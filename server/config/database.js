import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// SQL CONNECTION
export const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  })
  .promise();