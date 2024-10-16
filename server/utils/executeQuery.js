import { pool } from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function executeQuery(query, params = []) {
  const connection = await pool.getConnection();
  try {
    await pool.query(`USE ${process.env.MYSQL_DATABASE};`);
    const result = await connection.query(query, params);
    return result;
  } finally {
    connection.release();
  }
}
