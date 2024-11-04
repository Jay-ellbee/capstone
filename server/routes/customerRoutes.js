//routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyUser } = require('../middlewares/authMiddleware');

// Register a new customer
router.post('/register', customerController.registerCustomer);

router.put('/customer-address', customerController.setAddress);

router.get('/me', verifyUser, customerController.getUserInfo);

router.put('/update-profile', verifyUser, customerController.updateProfile);

//router.get('/orders', verifyUser, customerController.getOrders);

module.exports = router; // Ensure router is exported correctly
