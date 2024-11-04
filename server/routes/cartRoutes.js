// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add to cart
router.post('/add', cartController.addToCart);

// Add multiple items to cart
router.post('/multiple', cartController.addMultipleToCart);

// Remove from cart
router.delete('/remove', cartController.removeFromCart);

// Get cart items
router.get('/:registered_customer_id', cartController.getCartItems);

// Update quantity in cart
router.put('/update-quantity', cartController.updateCartQuantity);

module.exports = router;
