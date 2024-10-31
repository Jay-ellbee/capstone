// models/orderModel.js
const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

// Get all orders
const getAllOrders = async () => {
  try {
    const [result] = await pool.query(
      'SELECT order_id, arrangement_name, type_name, ord_qty, ord_date, status, completion_date FROM orders, arrangement, arrangement_type WHERE orders.arrangement_id = arrangement.arrangement_id AND arrangement.arrangement_type_id = arrangement_type.arrangement_type_id');
    return result;
  } catch (err) {
    throw new Error(`Error fetching orders: ${err.message}`);
  }
};

// Get a single order by order_id
const getOrderById = async (order_id) => {
  try {
    const [result] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [order_id]);
    return result[0] || null; // Return null if no order found
  } catch (err) {
    throw new Error(`Error fetching order with ID ${order_id}: ${err.message}`);
  }
};

// Create a new order
const createOrder = async (orderData) => {
  try {
    const { arrangement_id, ord_qty } = orderData;
    const order_id = await generateCustomId('orders', 'OR');

    const [result] = await pool.query(
      'INSERT INTO orders (order_id, arrangement_id, ord_qty) VALUES (?, ?, ?)',
      [order_id, arrangement_id, ord_qty]
    );
    return { order_id, arrangement_id, ord_qty };
  } catch (err) {
    throw new Error(`Error creating order: ${err.message}`);
  }
};

// Update an order
const updateOrder = async (order_id, updatedData) => {
  try {
    const { status, completion_date, ord_qty } = updatedData;

    const [result] = await pool.query(
      'UPDATE orders SET status = ?, completion_date = ?, ord_qty = ? WHERE order_id = ?',
      [status, completion_date, ord_qty, order_id]
    );
    return result;
  } catch (err) {
    throw new Error(`Error updating order with ID ${order_id}: ${err.message}`);
  }
};

// Update an order
const updateOrderStatus = async (order_id, updatedData) => {
  try {
    const { status} = updatedData;

    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, order_id]
    );
    return result;
  } catch (err) {
    throw new Error(`Error updating order with ID ${order_id}: ${err.message}`);
  }
};

// Delete an order
const deleteOrder = async (order_id) => {
  try {
    const [result] = await pool.query('DELETE FROM orders WHERE order_id = ?', [order_id]);
    return result;
  } catch (err) {
    throw new Error(`Error deleting order with ID ${order_id}: ${err.message}`);
  }
};

//Get order by date
const getOrdersByDate = async(date) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE DATE(ord_date) = ?',
      [date]
    );
    return orders;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByDate
};
