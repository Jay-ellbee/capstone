//controllers/adminController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const adminModel = require('../models/adminModel');
const orderModel = require('../models/orderModel');
const { generateCustomId } = require('../utils/idGenerator');

dotenv.config();

// Admin login (supports hardcoded super admin)
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hardcoded super admin credentials
    if (email === 'superadmin@example.com' && password === 'superadminpassword') {
      const token = jwt.sign(
        { admin_id: 'SA0001', role: 'super_admin' },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.json({ token, role: 'super_admin' });
    }

    // Find admin by email
    const admin = await adminModel.findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, role: admin.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin creation (super admin only)
const createAdmin = async (req, res) => {
  const { user_fname, user_lname, email, password, role } = req.body;

  try {
    // Count the existing admins to generate a new admin ID
    const count = await adminModel.countAdmins();
    const newAdminId = `AD${String(count + 1).padStart(5, '0')}`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // New admin data
    const newAdmin = {
      admin_id: newAdminId,
      user_fname,
      user_lname,
      email,
      password: hashedPassword,
      role,
    };

    // Insert new admin into the database
    const result = await adminModel.createAdmin(newAdmin);
    res.status(201).json({ msg: 'Admin created successfully', admin_id: newAdminId });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// CRUD Operations for Orders

// Retrieve all orders
const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
};

// Retrieve specific order by ID
const getOrderById = async (req, res) => {
  const { order_id } = req.params;
  try {
    const order = await orderModel.getOrderById(order_id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ msg: 'Error fetching order' });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { arrangement_id, ord_qty } = req.body;
  try {
    const order_id = await generateCustomId('orders', 'OR');
    await orderModel.createOrder({ order_id, arrangement_id, ord_qty });
    res.status(201).json({ msg: 'Order created successfully', order_id });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Error creating order' });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const { status, completion_date, ord_qty } = req.body;
  try {
    await orderModel.updateOrder(order_id, { status, completion_date, ord_qty });
    res.json({ msg: 'Order updated successfully' });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ msg: 'Error updating order' });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    await orderModel.deleteOrder(order_id);
    res.json({ msg: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ msg: 'Error deleting order' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await adminModel.getCustomers();
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ msg: 'Error fetching customers' });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getCustomers
};
