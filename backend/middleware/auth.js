import jwt from 'jsonwebtoken';
import { dbPromise } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user exists in database using user_id
    const db = await dbPromise;
    const [users] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [decoded.user_id]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const JWT_SECRET_KEY = JWT_SECRET;