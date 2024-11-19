// controllers/orderController.js
const Order = require('../models/orderModel');
const {generateCustomId} = require('../utils/idGenerator');
const pool = require('../config/database');
const Customer = require('../models/customerModel');

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
    const { status, delivery_date, ord_qty } = req.body;
    const updatedData = { status, delivery_date, ord_qty };
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
    const {
        registered_customer_id,
        rec_name,
        address,
        customer_name,
        notes,
        delivery_method,
        phone,
        email,
        referenceId,
        orderDetails,
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        console.log("Starting transaction for placing order...");

        // Insert into transaction table
        const transaction_id = await generateCustomId("transaction", "TR");
        await connection.query(
            `INSERT INTO transaction (transaction_id, reference_id, registered_customer_id, date, rec_name, address, delivery_method, phone, email, customer_name, notes)
             VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
            [transaction_id, referenceId, registered_customer_id, rec_name, address, delivery_method, phone, email, customer_name, notes]
        );

        let orderCounter = 0;
        let saleCounter = 0; // Counter for unique sales IDs within this transaction
        const orderIds = [];

        for (const order of orderDetails) {
            const { arrangement_id, quantity, delivery_date } = order;
            const order_id = await generateCustomId("order", "OR", orderCounter++);
            await connection.query(
                `INSERT INTO \`order\` (order_id, arrangement_id, ord_date, status, delivery_date, ord_qty)
                 VALUES (?, ?, NOW(), 'pending', ?, ?)`,
                [order_id, arrangement_id, delivery_date, quantity]
            );

            const transaction_order_id = await generateCustomId("transaction_order_linking", "TL", orderCounter);
            await connection.query(
                `INSERT INTO transaction_order_linking (transaction_order_linking_id, transaction_id, order_id)
                 VALUES (?, ?, ?)`,
                [transaction_order_id, transaction_id, order_id]
            );

            const [products] = await connection.query(
                `SELECT product_id, qty_used FROM prods_arr_linking WHERE arrangement_id = ?`,
                [arrangement_id]
            );
            const [materials] = await connection.query(
                `SELECT material_id, qty_used FROM mats_arr_linking WHERE arrangement_id = ?`,
                [arrangement_id]
            );


            for (const { product_id, qty_used } of products) {
                const required_qty = qty_used * quantity;
                let remainingQty = required_qty;
            
                while (remainingQty > 0) {
                    const [batches] = await connection.query(
                        `SELECT batch_id, stock_qty, price_per_pc
                        FROM batch_product
                        WHERE product_id = ? AND is_expired = FALSE
                        AND stock_qty > 0
                        ORDER BY expiration_date ASC
                        LIMIT 1`,
                        [product_id]
                    );
            
                    if (batches.length === 0) {
                        throw new Error(`Insufficient stock for product ${product_id}`);
                    }
            
                    const batch = batches[0];
                    const deductedQty = Math.min(batch.stock_qty, remainingQty);
            
                    // Deduct only from stock_qty
                    const newStockQty = batch.stock_qty - deductedQty;
            
                    await connection.query(
                        `UPDATE batch_product 
                         SET stock_qty = ?
                         WHERE batch_id = ? AND product_id = ?`,
                        [newStockQty, batch.batch_id, product_id]
                    );
            
                    // Log the sale
                    const sale_id = await generateCustomId("sales", "SL", saleCounter++);
                    await connection.query(
                        `INSERT INTO sales (sales_id, batch_id, product_id, qty_sold, sale_price)
                         VALUES (?, ?, ?, ?, ?)`,
                        [
                            sale_id,
                            batch.batch_id,
                            product_id,
                            deductedQty,
                            batch.price_per_pc * deductedQty,
                        ]
                    );
            
                    console.log(`Logged sale: ${sale_id}, product ${product_id}, batch ${batch.batch_id}`);
                    remainingQty -= deductedQty;
                }
            }
            
            // Update material stock
            for (const { material_id, qty_used } of materials) {
                const required_qty = qty_used * quantity;
                const [materialStock] = await connection.query(
                    `SELECT stock_qty FROM material WHERE material_id = ? AND stock_qty >= ? LIMIT 1`,
                    [material_id, required_qty]
                );

                if (materialStock.length > 0 && materialStock[0].stock_qty >= required_qty) {
                    const newStockQty = materialStock[0].stock_qty - required_qty;
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
        res.status(200).json({ message: "Order placed and stock updated successfully", orderIds });
    } catch (error) {
        await connection.rollback();
        console.error("Error processing order:", error.message);
        res.status(500).json({ error: "Failed to place order and update stock", details: error.message });
    } finally {
        connection.release();
    }
};



exports.getOrders = async (req, res) => {
    try {
        // Get registered_customer_id from decoded token
        const { user_id } = req.customer;
        // Fetch orders from the model
        const orders = await Order.getOrdersByCustomerId(user_id);

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


exports.getOrdersByCustomerId = async (req, res) => {
    try {
        const registered_customer_id = req.params.registered_customer_id;
        const orders = await Order.getOrdersByCustomerId(registered_customer_id);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};