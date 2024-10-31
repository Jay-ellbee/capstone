// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Route to get all orders
router.get('/orders/',orderController.getAllOrders);

// Route to get a specific order by ID
router.get('/orders/:orderId', orderController.getOrderById);

// Route to create a new order
router.post('/orders/', orderController.createOrder);

// Route to update an existing order
router.put('/orders/:orderId', orderController.updateOrder);
router.put('/orders/stat/:orderId', orderController.updateOrderStatus);

// Route to delete an order
router.delete('/orders/:orderId', orderController.deleteOrder);

// Route to get orders by date
router.get('/orders', orderController.getOrdersByDate);

module.exports = router;
