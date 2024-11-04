// routes/transactionRoutes.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, verifyAdmin, verifySuperAdmin } = require('../middlewares/authMiddleware');

// Get all transactions (accessible by admin and super_admin)
router.get('/transactions/',  transactionController.getAllTransactions);

// Get a single transaction by ID (accessible by admin and super_admin)
router.get('/transactions/:id', transactionController.getTransactionById);

// Create a new transaction (accessible by admin and super_admin) with validation
// router.post(
//   '/transactions/',
//   [
//     check('date').isISO8601().withMessage('Invalid date format'),
//     check('reference_id').isLength({ min: 1 }).withMessage('Reference ID is required'),
//     check('rec_name').isLength({ min: 1 }).withMessage('Recipient name is required'),
//     check('address').isLength({ min: 1 }).withMessage('Address is required')
//   ],
//   transactionController.createTransaction
// );

// Update an existing transaction (accessible by admin and super_admin) with validation
// router.put(
//   '/transactions/:id',
//   [
//     check('rec_name').optional().isLength({ min: 1 }).withMessage('Recipient name is required'),
//     check('address').optional().isLength({ min: 1 }).withMessage('Address is required')
//   ],
//   transactionController.updateTransaction
// );

// Delete a transaction (accessible only by super_admin)
//router.delete('/transactions/:id', transactionController.deleteTransaction);

// Get monthly and weekly revenue
router.get('/transactions/revenue/month', transactionController.getCurrentMonthSales);
router.get('/transactions/revenue/week', transactionController.getCurrentWeekSales);

module.exports = router;
