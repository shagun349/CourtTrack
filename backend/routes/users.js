import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbPromise } from '../db.js';
import { auth, JWT_SECRET_KEY } from '../middleware/auth.js';

const router = express.Router();

// Ensure users table exists with the expected schema (if you already have it, this will be noop)
const initTables = async () => {
  try {
    const db = await dbPromise;
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255),
        role ENUM('lawyer','client') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ensured');
  } catch (err) {
    console.error('Error ensuring users table:', err);
    throw err;
  }
};

initTables().catch(err => {
  console.error('Failed to ensure users table:', err);
  process.exit(1);
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'Please provide name, email, password and role' });
  }

  if (!['lawyer', 'client'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be lawyer or client' });
  }
  
  try {
    const db = await dbPromise;
    
    // Check if user exists
    const [existingUsers] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    const token = jwt.sign({ user_id: result.insertId, role }, JWT_SECRET_KEY);
    res.status(201).json({ token, message: 'User registered successfully' });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  try {
    const db = await dbPromise;
    const [users] = await db.query('SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET_KEY);
    res.json({ token, message: 'Logged in successfully' });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get current user (protected route example)

router.get('/me', auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const [users] = await db.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
    
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ 
      message: 'Failed to get user data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;