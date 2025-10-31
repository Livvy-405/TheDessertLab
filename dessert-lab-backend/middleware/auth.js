// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/Order');

// Basic authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Staff or admin authentication middleware
const staffAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Check if user has staff or admin role
    if (!['admin', 'staff'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Staff role required.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Staff auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth, staffAuth };
