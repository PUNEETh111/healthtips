// ============================================================
// JWT AUTHENTICATION MIDDLEWARE
// Verifies JWT tokens to protect private routes
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Middleware to verify JWT token and attach user to request
 * Used on all routes that require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token format)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token payload (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token may be invalid.'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token is invalid or expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }
};

/**
 * adminOnly - Middleware to restrict access to admin users only
 * Must be used AFTER the protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

module.exports = { protect, adminOnly };
