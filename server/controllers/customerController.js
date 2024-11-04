// controllers/customerController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Register a new customer
exports.registerCustomer = async (req, res) => {
    try {
        const { user_fname, user_lname, email, username, password, phone, address } = req.body;

        // Check if email or username already exists
        const existingCustomer = await Customer.findCustomerByEmailOrUsername(email, username);
        if (existingCustomer) {
            return res.status(409).json({ error: 'Email or username already exists.' });
        }

        // Hash password and register customer
        const hashedPassword = await bcrypt.hash(password, 10);
        const registered_customer_id = await Customer.registerCustomer({
            user_fname, user_lname, email, username, password: hashedPassword, phone, address
        });

        // Generate JWT token upon successful registration
        const token = jwt.sign(
            { user_id: registered_customer_id, email, role: 'customer' },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send response with token and customer information
        res.status(201).json({
            message: 'Customer registered successfully',
            customerId: registered_customer_id,
            token,
            role: 'customer'
        });
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).json({ error: 'Error registering customer' });
    }
};

exports.setAddress = async (req, res) => {
    const { registered_customer_id, address } = req.body;
    try {
        const result = await Customer.setAddress(registered_customer_id, address);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Address updated successfully' });
    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({ error: 'Failed to update address' });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const { user_id } = req.customer; // assuming `req.user` has been populated by middleware

        // Fetch user details based on `registered_customer_id`
        const user = await Customer.findById(user_id); // Adjust the function based on your ORM or DB setup

        if (!user) {
            console.error(`User with ID ${registered_customer_id} not found`); // Debug log
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            firstName: user.user_fname,
            lastName: user.user_lname,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            // Add other fields as needed
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { user_id } = req.customer; // assuming `req.user` has been populated by middleware
        const { username, email, phone, address } = req.body;
        const result = await Customer.updateProfile(user_id, username, email, phone, address);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
