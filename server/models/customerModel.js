// models/customerModel.js
const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

// Register a new customer
const registerCustomer = async (customerData) => {
    const registered_customer_id = await generateCustomId('registered_customer', 'RC');
    const { user_fname, user_lname, email, username, password, phone, address } = customerData;
    await pool.query(
        `INSERT INTO registered_customer (registered_customer_id, user_fname, user_lname, email, username, password, phone, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [registered_customer_id, user_fname, user_lname, email, username, password, phone, address]
    );
    return registered_customer_id;
};

// Find customer for login by email
const findCustomerByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM registered_customer WHERE email = ?', [email]);
    return rows[0];
};

// Check for existing email/username during registration
const findCustomerByEmailOrUsername = async (email, username) => {
    const [rows] = await pool.query(
        'SELECT * FROM registered_customer WHERE email = ? OR username = ?',
        [email, username]
    );
    return rows[0];
};

const findById = async (registered_customer_id) => {
    const [rows] = await pool.query('SELECT * FROM registered_customer WHERE registered_customer_id = ?', [registered_customer_id]);
    return rows[0];
};

const setAddress = async (registered_customer_id, address) => {
    const [result] = await pool.query(
        `UPDATE registered_customer SET address = ? WHERE registered_customer_id = ?`,
        [address, registered_customer_id]       
    );
    return result;
};

const updateProfile = async (user_id, username, email, phone, address) => {
    const [result] = await pool.query(
        `UPDATE registered_customer SET username = ?, email = ?, phone = ?, address = ? WHERE registered_customer_id = ?`,
        [username, email, phone, address, user_id]
    );
    return result;
};

module.exports = {
    registerCustomer,
    findCustomerByEmail,
    findCustomerByEmailOrUsername,
    setAddress,
    findById,
    updateProfile
};
