// import sql
import mysql from 'mysql2/promise'

// import config
import {config} from 'dotenv'
config();

// import express
import express from 'express'

const app = express()
app.use(express.json())

// store port in variable
const PORT = process.env.PORT || 3000

const pool = mysql.createPool({
    hostname: process.env.HOSTNAME,
    user:process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// 2. Create a route with a path of ‘products’ :
// a. that returns all the products in the database.

app.get('/products', async (req,res) => {
    try {
        const [products] = await pool.query('select * from products');
        res.json(products);
    } catch (error) {
        console.error("Error: " . error);
        res.status(500).json({error: "Database error"});
        
    }
});

// b. that returns a single product based on its primary key.
const getSingle = async(id) =>{
    let [data] = await pool.query('SELECT * FROM products where product_code = ?',[id])
    return data 

}

app.get('/products/:product_code', async(req,res)=> {
const product_code = req.params.product_code
console.log('heeyeyeyeyeyey');
res.json({product: await getSingle(product_code)})

});

// c. that inserts a new product within the database.
app.post('/products/insert', async(req,res)=>{
    try {
        // Extract product data from the request body
        const { product_code, product_name, product_price, product_quantity } = req.body;

        if (!product_name || !product_price || !product_quantity || !product_code) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Call the insert function
        const result = await insertNewProduct(product_code, product_name, product_price, product_quantity);
        
        // Send a response back with the result
        res.status(201).json({
            message: 'Product successfully inserted',
            product: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to insert product', error });
    }
})

const insertNewProduct = async(product_code,product_name,product_price,product_quantity) =>{
    let [data] =  await pool.query('insert into products(product_code,product_name,product_price,product_quantity) values(?,?,?,?)',
        [product_code,product_name,product_price,product_quantity])
    return data 
}

// d. that deletes a product based on its primary key.
const deleteProduct = async(product_code)=>{
    let [data] = await pool.query('delete from products where product_code=?',[product_code])
    return data
}

app.delete('/products/delete', async(req,res)=>{
    try{
        const {product_code} = req.body
        const result = await deleteProduct(product_code);
        res.status(200).json({ message: 'Product deleted successfully', result });

    }catch(error){
        res.status(500).json({ message: 'Failed to delete product', error });
    }
})

// e. that updates a product based on its primary key.
const updateProduct = async(product_name,product_price,product_quantity,product_code)=>{
    let [data] = await pool.query(
        'update products set product_name=?,product_price=?,product_quantity=? where product_code=?',
        [product_name,product_price,product_quantity,product_code])
    return data
}

app.put('/products/update',async(req,res)=>{
    try{
        const {product_name,product_price,product_quantity,product_code} = req.body
        const result = await updateProduct(product_name,product_price,product_quantity,product_code);
        res.status(200).json({ message: 'Product updated successfully', result });

    }catch(error){
        res.status(500).json({ message: 'Failed to update product', error });
    }
})


// 3. Create a route with a path of ‘users’:
// f. that returns all the users in the database.
app.get('/users', async (req,res) => {
    try {
        const [users] = await pool.query('select * from users');
        res.json(users);
    } catch (error) {
        console.error("Error: " . error);
        res.status(500).json({error: "Database error"});
        
    }
});

// g. that returns a single user based on its primary key.
const getSingleUser = async(id) =>{
    let [data] = await pool.query('SELECT * FROM users where id = ?',[id])
    return data 

}

app.get('/users/:id', async(req,res)=> {
    try{
        const {id} = req.params

        const user = await getSingleUser(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({user})
    }catch(error){
        res.status(500).json({ message: 'Failed to retrieve user', error });
    }
});

// h. that inserts a new user within the database.
app.post('/user/insert', async(req,res)=>{
    try {
        // Extract product data from the request body
        const {  email, first_name, last_name, password } = req.body;

        if (!email || !first_name || !last_name || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Call the insert function
        const result = await insertNewUser( `email`, `first_name`, `last_name`, `password`);
        
        // Send a response back with the result
        res.status(201).json({
            message: 'User successfully inserted',
            product: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to insert User', error });
    }
})

const insertNewUser = async( email, first_name, last_name, password ) =>{
    let [data] =  await pool.query(
        'INSERT INTO `shopleft_database`.`users` ( `email`, `first_name`, `last_name`, `password`) VALUES (?,?,?,?);',
        [ email, first_name, last_name, password]
    )
    return data 
}

// i. that deletes a user based on its primary key.
const deleteUser = async(id)=>{
    let [data] = await pool.query('delete from users where id=?',[id])
    return data
}

app.delete('/user/delete/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const result = await deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully', result });

    }catch(error){
        res.status(500).json({ message: 'Failed to delete User', error });
    }
})


// api
app.listen(PORT,()=>{
    console.log('http://localhost:'+PORT);
    console.log('something');
})
