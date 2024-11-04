// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).json({ msg: 'No token, authorization denied' });
  

  try {
    const bearerToken = token.split(' ')[1];  // Extract the token after 'Bearer'
    console.log('Received Token:', bearerToken);  // Log received token for debugging

    const decoded = await jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    console.log('Decoded Token:', decoded);  // Log decoded token for debugging

    req.admin = decoded;  // Attach admin details to request
    next();
  } catch (err) {
    console.error('Token verification error:', err);  // Log any errors in verification
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to verify if user is a super admin
const verifySuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ msg: 'Access denied. Only Super Admins can perform this action.' });
  }
  next();
};

// Middleware to verify admin role (super admin or regular admin)
const verifyAdmin = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const bearerToken = token.split(' ')[1];  // Extract the token after 'Bearer'
    const decoded = await jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

    if (decoded.role === 'admin' || decoded.role === 'super_admin') {
      req.user = decoded;  // Attach user info to the request
      next();
    } else {
      return res.status(403).json({ message: 'Insufficient privileges' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to verify JWT token for customers
const verifyUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).json({ msg: 'No token, authorization denied' });

  try {
    const bearerToken = token.split(' ')[1]; // Extract the token after 'Bearer'
    console.log('Received Token:', bearerToken); // Log received token for debugging

    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    console.log('Decoded Token:', decoded); // Log decoded token for debugging

    // Assuming customers don't have a role field, just attach their ID
    req.customer = decoded; // Attach customer details to request
    next();
  } catch (err) {
    console.log('Token verification error:', err); // Log any errors in verification
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {
  verifyToken,
  verifySuperAdmin,
  verifyAdmin,
  verifyUser
};
