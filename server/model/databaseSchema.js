import { pool } from '../config/database.js';

// create database and tables
export const createSchema = async () => {
    // const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`;
    const useDatabaseQuery = `USE ${process.env.MYSQL_DATABASE};`;
  
    // await pool.query(createDatabaseQuery);
    await pool.query(useDatabaseQuery);
  
    // for (const tableQuery of createQueries) {
    //   await pool.query(useDatabaseQuery);
    //   await pool.query(tableQuery);
    // }
  
    return 'DATABASE CREATED';
  };