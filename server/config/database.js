const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
//

// SQL CONNECTION
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,  
}).promise();

pool.query('SELECT 1').then(() => {
  console.log('Database connected successfully');
}).catch((err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;