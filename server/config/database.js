import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config({ path: '../.env' });

// SQL CONNECTION
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,  
}).promise();
