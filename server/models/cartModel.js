// models/cartModel.js
const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

// Add arrangements to the cart
const addToCart = async (newCartItem) => {
    const { registered_customer_id, arrangements} = newCartItem;

    if (!Array.isArray(arrangements) || arrangements.length === 0) {
        throw new Error("Invalid arrangements format.");
    }

    for (const arrangement of arrangements) {
        const { arrangement_id, qty } = arrangement;

        if (!arrangement_id || qty === undefined) {
            console.error("Error: 'arrangement_id' or 'qty' missing in arrangement.", {
                registered_customer_id,
                arrangement_id,
                qty
            });
            continue;
        }

        const cart_id = await generateCustomId('cart', 'CI');
        
        await pool.query(
            `INSERT INTO cart (cart_id, registered_customer_id, arrangement_id, qty) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)`,
            [cart_id, registered_customer_id, arrangement_id, qty]
        );
        console.log(`Cart entry for arrangement ${arrangement_id} added or updated successfully.`);
    }

    return { message: "Items processed successfully." };
};

// Get all items in the cart for a specific customer
const getCartByCustomerId = async (registered_customer_id) => {
    const [results] = await pool.execute(
        'SELECT * FROM cart WHERE registered_customer_id = ?',
        [registered_customer_id]
    );
    return results;
};

// Clear the cart for a specific customer
const clearCartByCustomerId = async (registered_customer_id) => {
    const [result] = await pool.execute(
        'DELETE FROM cart WHERE registered_customer_id = ?',
        [registered_customer_id]
    );
    return result;
};

// Remove an arrangement from the cart
const removeFromCart = async (registered_customer_id, arrangement_id) => {
    await pool.query(
        'DELETE FROM cart WHERE registered_customer_id = ? AND arrangement_id = ?',
        [registered_customer_id, arrangement_id]
    );
};

// Get cart items for a customer
const getCartItems = async (registered_customer_id) => {
    const [results] = await pool.query(
        `SELECT cart.cart_id, cart.qty, arrangement.arrangement_id, arrangement.arrangement_name, arrangement.price, arrangement.img_link
         FROM cart
         JOIN arrangement ON cart.arrangement_id = arrangement.arrangement_id
         WHERE cart.registered_customer_id = ?`,
        [registered_customer_id]
    );
    return results;
};

// Update the quantity of an item in the cart
const updateQuantity = async (registered_customer_id, arrangement_id, new_qty) => {
    await pool.query(
        'UPDATE cart SET qty = ? WHERE registered_customer_id = ? AND arrangement_id = ?',
        [new_qty, registered_customer_id, arrangement_id]
    );
};

const addMultipleToCart = async (registered_customer_id, arrangements) => {
    if (!Array.isArray(arrangements) || arrangements.length === 0) {
        throw new Error("Invalid arrangements format.");
    }

    for (const arrangement of arrangements) {
        const { arrangement_id, qty, rec_name, address } = arrangement;

        if (!arrangement_id || qty === undefined || !rec_name || !address) {
            console.error("Error: Missing fields in arrangement.", {
                registered_customer_id,
                arrangement_id,
                qty,
                rec_name,
                address
            });
            continue;
        }

        const cart_id = await generateCustomId('cart', 'CI');
        
        await pool.query(
            `INSERT INTO cart (cart_id, registered_customer_id, arrangement_id, qty, rec_name, address) 
             VALUES (?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)`,
            [cart_id, registered_customer_id, arrangement_id, qty, rec_name, address]
        );
        console.log(`Cart entry for arrangement ${arrangement_id} added or updated successfully.`);
    }

    return { message: "Multiple items processed successfully." };
};

// Cart model class
class Cart {
    static async addToCart({ registered_customer_id, arrangements, rec_name, address }) {
        const cart_id = await generateCustomId('cart', 'CART');
        const sql = `INSERT INTO cart (cart_id, registered_customer_id, arrangements, rec_name, address)
                     VALUES (?, ?, ?, ?, ?)`;

        const values = [cart_id, registered_customer_id, JSON.stringify(arrangements), rec_name, address];
        return pool.execute(sql, values);
    }

    static async addMultipleToCart(registered_customer_id, arrangements) {
        const sql = `INSERT INTO cart (registered_customer_id, arrangements) VALUES (?, ?)`;
        const promises = arrangements.map(arrangement => {
            const values = [registered_customer_id, JSON.stringify(arrangement)];
            return pool.execute(sql, values);
        });
        return Promise.all(promises);
    }

    static async getCartItems(registered_customer_id) {
        const sql = `SELECT * FROM cart WHERE registered_customer_id = ?`;
        const [rows] = await pool.execute(sql, [registered_customer_id]);
        return rows;
    }

    static async updateQuantity(registered_customer_id, arrangement_id, new_qty) {
        const sql = `UPDATE cart SET arrangements = JSON_REPLACE(arrangements, '$.qty', ?) WHERE registered_customer_id = ? AND JSON_CONTAINS(arrangements, ?)`;
        return pool.execute(sql, [new_qty, registered_customer_id, JSON.stringify({ arrangement_id })]);
    }

    static async removeFromCart(registered_customer_id, arrangement_id) {
        const sql = `DELETE FROM cart WHERE registered_customer_id = ? AND JSON_CONTAINS(arrangements, ?)`;
        return pool.execute(sql, [registered_customer_id, JSON.stringify({ arrangement_id })]);
    }

    static async clearCartByCustomerId(registered_customer_id) {
        const sql = `DELETE FROM cart WHERE registered_customer_id = ?`;
        return pool.execute(sql, [registered_customer_id]);
    }
}

module.exports = {
    addToCart,
    addMultipleToCart,
    getCartItems,
    updateQuantity,
    getCartByCustomerId,
    clearCartByCustomerId,
    removeFromCart,
    Cart
};