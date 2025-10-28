import express from "express";
import { dbPromise } from "../db.js";
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Initialize judges table
const initTables = async () => {
  try {
    const db = await dbPromise;
    await db.query(`
      CREATE TABLE IF NOT EXISTS judges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        court VARCHAR(255) NOT NULL,
        experience INT,
        appointed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Judges table initialized');
  } catch (err) {
    console.error('Error creating judges table:', err);
    throw err;
  }
};

// Initialize tables
initTables().catch(err => {
  console.error('Failed to initialize judges table:', err);
  process.exit(1);
});

// Get all judges or search
router.get("/judges", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const { search } = req.query;
    
    if (search) {
      const searchPattern = `%${search}%`;
      const [data] = await db.query(
        "SELECT * FROM judges WHERE name LIKE ? OR court LIKE ?",
        [searchPattern, searchPattern]
      );
      res.json(data);
    } else {
      const [data] = await db.query("SELECT * FROM judges");
      res.json(data);
    }
  } catch (err) {
    console.error('Error fetching judges:', err);
    res.status(500).json({ 
      message: 'Failed to fetch judges',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get judge by ID
router.get("/judges/:id", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const [data] = await db.query(
      "SELECT * FROM judges WHERE id = ?",
      [req.params.id]
    );
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error('Error fetching judge:', err);
    res.status(500).json({ 
      message: 'Failed to fetch judge',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;