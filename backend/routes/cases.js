import express from "express";
import { dbPromise } from "../db.js";
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Initialize cases table
const initTables = async () => {
  try {
    const db = await dbPromise;
    await db.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        filed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Cases table initialized');
  } catch (err) {
    console.error('Error creating cases table:', err);
    throw err;
  }
};

// Initialize tables
initTables().catch(err => {
  console.error('Failed to initialize cases table:', err);
  process.exit(1);
});

// Get all cases or search
router.get("/cases", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const { search } = req.query;
    
    if (search) {
      const searchPattern = `%${search}%`;
      const [data] = await db.query(
        "SELECT * FROM cases WHERE title LIKE ? OR description LIKE ?",
        [searchPattern, searchPattern]
      );
      res.json(data);
    } else {
      const [data] = await db.query("SELECT * FROM cases");
      res.json(data);
    }
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ 
      message: 'Failed to fetch cases',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get case by ID
router.get("/cases/:id", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const [data] = await db.query(
      "SELECT * FROM cases WHERE id = ?",
      [req.params.id]
    );
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error('Error fetching case:', err);
    res.status(500).json({ 
      message: 'Failed to fetch case',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;