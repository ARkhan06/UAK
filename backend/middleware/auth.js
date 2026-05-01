const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Attach user ID to request
    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Optional token verification - doesn't fail if no token (for guest bookings)
const verifyTokenOptional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // No token provided - this is fine for guest bookings
      req.user = null;
      return next();
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      // No token - this is fine for guest bookings
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Attach user ID to request
    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    // Token exists but is invalid/expired - still allow as guest
    req.user = null;
    next();
  }
};

module.exports = { verifyToken, verifyTokenOptional };
