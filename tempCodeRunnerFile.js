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

// function return all users
// const getUsers = async ()=>{
//     let [data] = await pool.query('select * from users')
//     return data
// }

// function return all products
// const getProducts = async ()=>{
//     let [data] = await pool.query('select * from products')
//     return data
// }

// a. a function that deletes a product(delete the product ‘baro’ completely).
// const deleteProduct = async (product_code)=>{
//     let [data] = await pool.query('delete  from products where product_code=?',[product_code])
//     return await getProducts()
// }

// b. a function that inserts a new product (insert your favourite food item).
// const insertNewProduct = async(product_code, product_name, product_price, product_quantity)=>{
//     let [data] = await pool.query('insert into products(product_code, product_name, product_price, product_quantity) values(?,?,?,?) ',
//         [product_code, product_name, product_price, product_quantity])
//     return await getProducts()
// }
// console.log(await insertNewProduct('tex04','ex',5.00,50));

// c. a function that will update the existing product information.
// const updateExistingProductInfo = async( product_name, product_price, product_quantity ,product_code)=>{
//     let [data] = await pool.query(
//         'update products set product_name=? , product_price=?, product_quantity=? where product_code = ?',
//         [ product_name, product_price, product_quantity,product_code]
//     )
//     return await getProducts()
// }


// test
// console.log(await getUsers());
// console.log(await getProducts());
// console.log(await deleteProduct('baro1'));
// console.log(await updateExistingProductInfo('Texi',19.00,79,'tex01'));









// 2. Create a route with a path of ‘products’ :
// a. that returns all the products in the database.
app.get('/products', fetch = async() => {
    let [data] = pool.query('select * from products')
    return data
})

app.get('/products', async (req,res) => {
    try {
        const [products] = await pool.query('select * from products');
        res.json(products);
    } catch (error) {
        console.error("Error: " . error);
        res.status(500).json({error: "Database error"});
        
    }
});

// console.log(await fetch());


// Convert the query to a promise-based function to work with async/await
const returnSingleProduct = async (productCode) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products WHERE product_code = ?', [productCode], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);  // Return the results
        });
    });
};

// Route that returns a single product based on its product_code
app.get('/products/:product_code', async (req, res) => {
    const productCode = req.params.product_code;  // Get product_code from URL parameter

    try {
        const results = await returnSingleProduct(productCode);  // Await the product result

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(results[0]);  // Return the first matching product as JSON
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
});


// c. that inserts a new product within the database.

// d. that deletes a product based on its primary key.

// e. that updates a product based on its primary key.

// 3. Create a route with a path of ‘users’:
// f. that returns all the users in the database.

// g. that returns a single user based on its primary key.

// h. that inserts a new user within the database.

// i. that deletes a user based on its primary key.



// api
app.listen(PORT,()=>{
    console.log('http://localhost:'+PORT);
    console.log('something');
})