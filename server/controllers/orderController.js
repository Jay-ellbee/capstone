// controllers/orderController.js
const Order = require('../models/orderModel');
const {generateCustomId} = require('../utils/idGenerator');
const pool = require('../config/database');

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

  // Create a new order
  exports.placeOrder = async (req, res) => {
    const { registered_customer_id, rec_name, address, customer_name, notes,delivery_method, phone, email, referenceId, orderDetails } = req.body;

    const connection = await pool.getConnection();
    console.log(orderDetails.completion_date);

    try {
        await connection.beginTransaction();
        console.log("Starting transaction for placing order...");

        // Insert into transaction table
        const transaction_id = await generateCustomId('transaction', 'TR');
        await connection.query(
            `INSERT INTO transaction (transaction_id, reference_id, registered_customer_id, date, rec_name, address, delivery_method, phone, email, customer_name, notes)
             VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
            [transaction_id, referenceId, registered_customer_id, rec_name, address, delivery_method, phone, email, customer_name, notes]
        );

        let orderCounter = 0; // Counter for unique order IDs in the same transaction
        const orderIds = [];
        // Process each order in orderDetails
        for (const order of orderDetails) {
            const { arrangement_id, quantity, completion_date } = order;
            const order_id = await generateCustomId('order', 'OR', orderCounter++); // Increment for each order

            // Insert order
            await connection.query(
                `INSERT INTO \`order\` (order_id, arrangement_id, ord_date, status, completion_date, ord_qty)
                 VALUES (?, ?, NOW(), 'pending', ?, ?)`,
                [order_id, arrangement_id,completion_date, quantity]
            );

            // Link the order to the transaction
            const transaction_order_id = await generateCustomId('transaction_order_linking', 'TL', orderCounter);
            await connection.query(
                `INSERT INTO transaction_order_linking (transaction_order_linking_id, transaction_id, order_id)
                 VALUES (?, ?, ?)`,
                [transaction_order_id, transaction_id, order_id]
            );

            // Retrieve products and materials for arrangement and update stocks
            const [product] = await connection.query(
                `SELECT product_id, qty_used FROM prods_arr_linking WHERE arrangement_id = ?`,
                [arrangement_id]
            );
            const [material] = await connection.query(
                `SELECT material_id, qty_used FROM mats_arr_linking WHERE arrangement_id = ?`,
                [arrangement_id]
            );

            // Update product stock
            for (const { product_id, qty_used } of product) {
                console.log("Processing product:", product_id, "Quantity used:", qty_used);
                const required_qty = qty_used * quantity;
                const [batch] = await connection.query(
                    `SELECT batch_id, stock_qty FROM batch
                     WHERE batch_id = (SELECT batch_id FROM product WHERE product_id = ?)
                     AND stock_qty >= ? LIMIT 1`,
                    [product_id, required_qty]
                );

                if (batch && batch.length > 0 && batch[0].stock_qty >= required_qty) {
                    const newStockQty = batch[0].stock_qty - required_qty;
                    await connection.query(
                        `UPDATE batch SET stock_qty = ? WHERE batch_id = ?`,
                        [newStockQty, batch[0].batch_id]
                    );
                    console.log(`Updated product stock for ${product_id}, batch ${batch[0].batch_id}: ${newStockQty}`);
                } else {
                    throw new Error(`Insufficient stock for product ${product_id}`);
                }
            }

            // Update material stock
            for (const { material_id, qty_used } of material) {
                const required_qty = qty_used * quantity;
                const [material] = await connection.query(
                    `SELECT stock_qty FROM material WHERE material_id = ? AND stock_qty >= ? LIMIT 1`,
                    [material_id, required_qty]
                );

                if (material && material.length > 0 && material[0].stock_qty >= required_qty) {
                    const newStockQty = material[0].stock_qty - required_qty;
                    await connection.query(
                        `UPDATE material SET stock_qty = ? WHERE material_id = ?`,
                        [newStockQty, material_id]
                    );
                    console.log(`Updated material stock for ${material_id}: ${newStockQty}`);
                } else {
                    throw new Error(`Insufficient stock for material ${material_id}`);
                }
            }
            orderIds.push(order_id); 
        }

        await connection.commit();
        res.status(200).json({ message: 'Order placed and stock updated successfully', orderIds });
        
    } catch (error) {
        await connection.rollback();
        console.error("Error processing order:", error.message);
        res.status(500).json({ error: 'Failed to place order and update stock', details: error.message });
    } finally {
        connection.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        // Get registered_customer_id from decoded token
        const registered_customer_id = req.user?.id;

        if (!registered_customer_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch orders from the model
        const orders = await Order.getOrdersByCustomerId(registered_customer_id);

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};