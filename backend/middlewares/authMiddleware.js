const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — verify JWT token and attach user to req
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Not authorized, no token',
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET missing');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

// Admin-only gate
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: 'Not authorized as an admin',
  });
};

module.exports = { protect, admin };