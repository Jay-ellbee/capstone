const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel');
const customerModel = require('../models/customerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Step 1: Check for hardcoded super admin credentials
      if (email === 'superadmin@example.com' && password === 'superadminpassword') {
        const token = jwt.sign(
          { user_id: 'SA00001', role: 'super_admin' },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );
        return res.json({ token, role: 'super_admin' });
      }
  
      // Step 2: Check for admin credentials
      const admin = await adminModel.findAdminByEmail(email);
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);       
        if (isMatch) {
          const token = jwt.sign(
            { user_id: admin.admin_id, role: 'admin' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          return res.json({ token, role: 'admin' });
        } else {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
      }
  
      // Step 3: Check for customer credentials
      const customer = await customerModel.findCustomerByEmail(email);
      if (customer) {
        const isMatch = await bcrypt.compare(password, customer.password);
        if (isMatch) {
          const token = jwt.sign(
            { user_id: customer.registered_customer_id, role: 'customer' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          return res.json({ token, role: 'customer' });
        } else {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
      }
  
      // If no matching user found, return an error
      return res.status(404).json({ msg: 'User not found' });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  module.exports = router;
