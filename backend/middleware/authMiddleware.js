import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This runs BEFORE protected routes
export const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in headers
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from DB
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4. Continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Token failed'
    });
  }
};
