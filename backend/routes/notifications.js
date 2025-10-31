import express from "express";
import { dbPromise } from "../db.js";
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Initialize notifications table
const initTables = async () => {
  try {
    const db = await dbPromise;
    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);
    console.log('✅ Notifications table initialized');
  } catch (err) {
    console.error('Error creating notifications table:', err);
    throw err;
  }
};

// Initialize tables
initTables().catch(err => {
  console.error('Failed to initialize notifications table:', err);
  process.exit(1);
});

// Get notifications for the logged-in user
router.get("/notifications", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const [notifications] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.user_id]
    );
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ 
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Mark notifications as read
router.put("/notifications/mark-read", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    await db.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
      [req.user.user_id]
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ 
      message: 'Failed to mark notifications as read',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;