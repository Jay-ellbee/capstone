// models/transactionModel.js
const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

// Get all transactions
const getAllTransactions = async () => {
    try {
      const [results] = await pool.query(
        'SELECT t.transaction_id, t.date, t.reference_id, o.order_id, t.registered_customer_id, t.rec_name, t.address, a.price * o.ord_qty as total FROM \`order\` AS o JOIN transaction_order_linking AS tol ON o.order_id = tol.order_id JOIN transaction AS t ON t.transaction_id = tol.transaction_id JOIN arrangement AS a ON o.arrangement_id = a.arrangement_id');
      return results;
    } catch (err) {
      throw new Error(`Error fetching transactions: ${err.message}`);
    }
  };
  
  // Get a single transaction by ID
  const getTransactionById = async (transactionId) => {
    try {
      const [result] = await pool.query('SELECT * FROM transaction WHERE transaction_id = ?', [transactionId]);
      return result[0] || null; // Return null if no transaction found
    } catch (err) {
      throw new Error(`Error fetching transaction with ID ${transactionId}: ${err.message}`);
    }
  };
  
  // Create a new transaction
  const createTransaction = async (transactionData) => {
    try {
      const { date, reference_id, registered_customer_id, rec_name, address } = transactionData;
      const transaction_id = await generateCustomId('transaction', 'TR');
  
      const [result] = await pool.query(
        'INSERT INTO transaction (transaction_id, date, reference_id, registered_customer_id, rec_name, address) VALUES (?, ?, ?, ?, ?, ?)',
        [transaction_id, date, reference_id, registered_customer_id, rec_name, address]
      );
  
      return { transaction_id, ...transactionData };
    } catch (err) {
      throw new Error(`Error creating transaction: ${err.message}`);
    }
  };
  
  // Update an existing transaction
  const updateTransaction = async (transactionId, transactionData) => {
    try {
      const { rec_name, address } = transactionData;
  
      const [result] = await pool.query(
        'UPDATE transaction SET rec_name = ?, address = ? WHERE transaction_id = ?',
        [rec_name, address, transactionId]
      );
  
      return result;
    } catch (err) {
      throw new Error(`Error updating transaction with ID ${transactionId}: ${err.message}`);
    }
  };
  
  // Delete a transaction
  const deleteTransaction = async (transactionId) => {
    try {
      const [result] = await pool.query('DELETE FROM transaction WHERE transaction_id = ?', [transactionId]);
      return result;
    } catch (err) {
      throw new Error(`Error deleting transaction with ID ${transactionId}: ${err.message}`);
    }
  };

  // Get Current month sales
  const getCurrentMonthSales = async () => {
    try {
      const [results] = await pool.query('SELECT COALESCE(SUM(arrangement.price * order.ord_qty), 0) AS total_sales FROM \`order\` JOIN arrangement ON order.arrangement_id = arrangement.arrangement_id WHERE order.status = "completed" AND YEAR(order.ord_date) = YEAR(CURRENT_DATE()) AND MONTH(order.ord_date) = MONTH(CURRENT_DATE());'
      );
      return results;
    } catch (err) {
      throw new Error(`Error fetching current month sales: ${err.message}`);
    }
  };

  // Get Current week sales
  const getCurrentWeekSales = async () => {
    try { 
      const [result] = await pool.query('SELECT COALESCE(SUM(arrangement.price * order.ord_qty), 0) AS weekly_sales FROM \`order\` JOIN arrangement ON order.arrangement_id = arrangement.arrangement_id WHERE order.status = "completed" AND YEAR(order.ord_date) = YEAR(CURRENT_DATE()) AND MONTH(order.ord_date) = MONTH(CURRENT_DATE()) AND WEEK(order.ord_date, 1) = WEEK(CURRENT_DATE(), 1);')
      return result;
    } catch (err) {
      throw new Error(`Error fetching current week sales: ${err.message}`);
    }
  };

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentMonthSales,
    getCurrentWeekSales
};
