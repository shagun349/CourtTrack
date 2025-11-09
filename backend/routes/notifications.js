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

// Count unread notifications
router.get("/notifications/unread-count", auth, async (req, res) => {
  try {
  const db = await dbPromise;
const [rows] = await db.query(
  "SELECT user_name, COUNT(*) AS unread_count FROM unread_notifications_view WHERE user_name = (SELECT name FROM users WHERE user_id = ?) GROUP BY user_name;",
  [req.user.user_id]
);

 

    if (rows.length > 0) {
      res.json({ unreadCount: rows[0].unread_count });
    } else {
      res.json({ unreadCount: 0 });
    }
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});


// * PUT /notifications/mark-read
// * Marks all unread notifications for the logged-in user as read
// * Returns the number of updated notifications and remaining unread 
router.put("/notifications/mark-read", auth, async (req, res) => {
  try {
    const db = await dbPromise;

    // Call the stored procedure
    const [rows] = await db.query("CALL MarkNotificationsRead(?)", [req.user.user_id]);

    // MySQL CALL result is nested: [ [ [ {updated_count, remaining_unread} ] ], metadata ]
    const { updated_count, remaining_unread } = rows[0][0];

    res.json({
      message: "✅ Notifications marked as read",
      updated_count,
      remaining_unread,
    });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({
      message: "❌ Failed to mark notifications as read",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;