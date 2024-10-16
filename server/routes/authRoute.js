import express from 'express';
import jwt from 'jsonwebtoken';
//import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const authRouter = express.Router();

// Add this check to ensure the secret key is available
// if (!SECRET_KEY) {
//     console.error('JWT secret key is missing');
//   }

// Rate limiter
// const LIMITER_TIMEOUT = 15; // minutes
// const LIMITER_LIMIT = 5;

// const limiter = rateLimit({
//   windowMs: LIMITER_TIMEOUT * 60 * 1000,
//   max: LIMITER_LIMIT,
//   message: 'Too many attempts, please try again later.',
// });

// Middleware to verify JWT and check user_type instead of roles
const verifyTokenAndUserType = (allowedTypes) => (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }

    // Check if the user_type matches the allowed types (e.g., 'admin', 'customer')
    if (!allowedTypes.includes(user.user_type)) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: Insufficient permissions' });
    }

    req.user = user;
    next();
  });
};

/**
 * LOGIN ROUTE: POST /api/auth
 * Temporary hardcoded credentials
 * temporarily removed limiter in the post constraint
 */
authRouter.post('/auth', (req, res) => {
    console.log('Inside /auth route handler');  // Add this to confirm route is hit
    
    const SECRET_KEY = process.env.JWT_SECRET_KEY   
    console.log('Loaded SECRET_KEY:', SECRET_KEY);  // Ensure key is available
  
    const { email, password } = req.body;
    console.log('Received email:', email, 'Received password:', password);  // Log received credentials
  
    if (email === 'admin@example.com' && password === 'admin123') {
      console.log('Credentials are valid, generating token...');  // Confirm credentials are correct
  
      try {
        const token = jwt.sign({ user_type: 'admin', email }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Generated token:', token);  // Log the generated token
        return res.json({ token, name: 'Admin User', role: 'admin' });
      } catch (err) {
        console.error('Error during JWT generation:', err);  // Log any error during token generation
        return res.status(500).json({ message: 'Error generating token' });
      }
    } else {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
  
  
  

// Protected route for admin
//temporarily removed limiter in the post constraint
authRouter.get(
  '/admin',
  verifyTokenAndUserType(['admin']),
  (req, res) => {
    res.json({ message: 'Admin access granted', user: req.user });
  }
);

// Protected route for registered customer
//temporarily removed limiter in the post constraint
authRouter.get(
  '/customer',
  
  verifyTokenAndUserType(['customer']),
  (req, res) => {
    res.json({ message: 'Customer access granted', user: req.user });
  }
);

// Public route
//temporarily removed limiter in the post constraint
authRouter.get('/public', (req, res) => {
  res.json({ message: 'Public access granted' });
});

export default authRouter;
