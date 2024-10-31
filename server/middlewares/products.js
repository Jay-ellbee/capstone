import dotenv from 'dotenv';
dotenv.config();

import {
  selectData,
  
} from '../utils/crudOperations.js';

const tableName = 'arrangement';

export async function selectArrangement(req, res, next) {
  try {
    const arrangement = await selectData(tableName);
    res.json(arrangement);
  } catch (error) {
    console.error("Error fetching arrangement data:", error); // Add this line
    next(error);
  }
}