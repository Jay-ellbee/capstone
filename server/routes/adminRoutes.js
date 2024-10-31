//routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifySuperAdmin } = require('../middlewares/authMiddleware');

console.log('Admin Controller:', adminController);  // Check what’s being imported

// Admin login route
router.post('/admin/login', adminController.loginAdmin);

// Create new admin (only super admins)
router.post('/admin/create', adminController.createAdmin);

// Orders CRUD routes
router.get('/admin/orders',  adminController.getOrders);
router.get('/admin/orders/:order_id', adminController.getOrderById);
router.post('/admin/orders', adminController.createOrder);
router.put('/admin/orders/:order_id', adminController.updateOrder);
router.delete('/admin/orders/:order_id', adminController.deleteOrder);

router.get('/admin/customers', adminController.getCustomers);

// Example transaction routes
//router.get('/transactions', verifyToken, adminController.getAllTransactions);
//router.get('/transactions/:transaction_id', verifyToken, adminController.getTransactionById);
//router.post('/transactions', verifyToken, adminController.createTransaction);
//router.put('/transactions/:transaction_id', verifyToken, adminController.updateTransaction);
//router.delete('/transactions/:transaction_id', verifyToken, adminController.deleteTransaction);

module.exports = router;
