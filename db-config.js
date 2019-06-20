const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

jawsdb_url = process.env.JAWSDB_URL;
// console.log(`Your JAWSDB_URL is ` + jawsdb_url);

// Set database connection credentials
/*
const config = {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database_name',
};
*/

// Create a MySQL pool
const pool = mysql.createPool(jawsdb_url);

// Export the pool
module.exports = pool;