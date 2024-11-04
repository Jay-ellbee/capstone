// controllers/cartController.js
const Cart = require('../models/cartModel');

// Add to cart
exports.addToCart = async (req, res) => {
    const { registered_customer_id, arrangement_id, qty } = req.body;
    console.log('Received payload:', req.body);

    // Validate that all required fields are present
    if (!registered_customer_id || !arrangement_id || qty === undefined) {
        console.error('Missing fields for adding to cart:', { registered_customer_id, arrangement_id, qty });
        return res.status(400).json({ error: 'Missing required fields: registered_customer_id, arrangement_id, qty' });
    }

    // Construct the new cart item with arrangements array format
    const newCartItem = {
        registered_customer_id,
        arrangements: [{ arrangement_id, qty }] // Keep arrangements as an array
    };

    try {
        // Assume Cart.addToCart is a function that takes the newCartItem object
        const response = await Cart.addToCart(newCartItem);
        console.log('Arrangement successfully added to cart for customer:', registered_customer_id);
        res.status(200).json({ message: 'Arrangement added to cart', data: response });
    } catch (error) {
        console.error('Error processing addToCart:', error);
        res.status(500).json({ error: 'Failed to add arrangement to cart' });
    }
};

exports.addMultipleToCart = async (req, res) => {
    const { registered_customer_id, arrangements } = req.body;

    if (!registered_customer_id || !Array.isArray(arrangements) || arrangements.length === 0) {
        return res.status(400).json({ error: 'Invalid request: Missing registered_customer_id or arrangements' });
    }

    try {
        const response = await Cart.addMultipleToCart(registered_customer_id, arrangements);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error adding multiple items to cart:', error);
        res.status(500).json({ error: 'Failed to add multiple items to cart' });
    }
};

// Remove an arrangement from the cart
exports.removeFromCart = async (req, res) => {
    try {
        await Cart.removeFromCart(req.body.registered_customer_id, req.body.arrangement_id);
        res.status(200).json({ message: 'Arrangement removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};

// Get all items in the cart
exports.getCartItems = async (req, res) => {
    try {
        const items = await Cart.getCartItems(req.params.registered_customer_id);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Failed to get cart items' });
    }
};

// Update quantity in cart
exports.updateCartQuantity = async (req, res) => {
    try {
        await Cart.updateQuantity(req.body.registered_customer_id, req.body.arrangement_id, req.body.new_qty);
        res.status(200).json({ message: 'Cart quantity updated successfully' });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ error: 'Failed to update cart quantity' });
    }
};