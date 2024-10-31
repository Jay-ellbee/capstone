// controllers/orderController.js
const Order = require('../models/orderModel');

// Retrieve all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrders();
        res.status(200).json({ orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Retrieve specific order by ID
exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ order });
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Error fetching order' });
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    const { arrangement_id, ord_qty } = req.body;
    const newOrderData = { arrangement_id, ord_qty };
    try {
        const result = await Order.createOrder(newOrderData);
        res.status(201).json({ message: 'Order created successfully', order: result });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Error creating order' });
    }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { status, completion_date, ord_qty } = req.body;
    const updatedData = { status, completion_date, ord_qty };
    try {
        const result = await Order.updateOrder(orderId, updatedData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Error updating order' });
    }
};

//Update an existing order status
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedData = { status };
    try {
        const result = await Order.updateOrderStatus(orderId, updatedData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Error updating order' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await Order.deleteOrder(orderId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).send();  // No content to send back
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Error deleting order' });
    }
};

exports.getOrdersByDate = async (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
  
    try {
      const orders = await getOrdersByDate(date);
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };