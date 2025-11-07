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
        filed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lawyer_id INT,
        client_id INT,
        status ENUM('pending','approved','rejected', 'won', 'lost') DEFAULT 'pending',
        hearing_date DATE,
        FOREIGN KEY (lawyer_id) REFERENCES users(user_id),
        FOREIGN KEY (client_id) REFERENCES users(user_id)
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

router.get("/cases/count", async (req, res) => {
  try {
    const db = await dbPromise;
    const [rows] = await db.query("CALL GetCaseCount()");
    const count = rows[0][0].count;
    res.json({ count });
  } catch (err) {
    console.error("Error fetching case count:", err);
    res.status(500).json({
      message: "Failed to fetch case count",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Get all cases or search
router.get("/cases", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const { search } = req.query;
    const { user_id, role } = req.user;

    let query = "SELECT * FROM cases WHERE ";
    const params = [];

    if (role === 'lawyer') {
      query += "lawyer_id = ?";
      params.push(user_id);
    } else if (role === 'client') {
      query += "client_id = ?";
      params.push(user_id);
    } else {
      return res.status(403).json({ message: 'You are not authorized to view cases' });
    }

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    const [data] = await db.query(query, params);
    res.json(data);
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

router.post("/cases/request", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const { title, description, lawyer_email, hearing_date } = req.body;
    const client_id = req.user.user_id;

    // Find lawyer by email
    const [lawyers] = await db.query("SELECT user_id FROM users WHERE email = ? AND role = 'lawyer'", [lawyer_email]);
    if (lawyers.length === 0) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    const lawyer_id = lawyers[0].user_id;

    // Get client's name
    const [clients] = await db.query("SELECT name FROM users WHERE user_id = ?", [client_id]);
    const client_name = clients[0].name;

    // Create case with pending status
    const [result] = await db.query(
      "INSERT INTO cases (title, description, lawyer_id, client_id, status, hearing_date) VALUES (?, ?, ?, ?, 'pending', ?)",
      [title, description, lawyer_id, client_id, hearing_date]
    );

    // Create notification for the lawyer
    const notificationMessage = `You have a new case request for \"${title}\" from the client ${client_name}`;
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [lawyer_id, notificationMessage]
    );

    res.status(201).json({ message: 'Case request sent successfully', case_id: result.insertId });
  } catch (err) {
    console.error('Error creating case request:', err);
    res.status(500).json({ 
      message: 'Failed to create case request',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post("/cases", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const { title, description, client_email, hearing_date } = req.body;
    const lawyer_id = req.user.user_id;

    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can create cases' });
    }

    // Find client by email
    const [clients] = await db.query("SELECT user_id FROM users WHERE email = ? AND role = 'client'", [client_email]);
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const client_id = clients[0].user_id;

    // Get lawyer's name
    const [lawyers] = await db.query("SELECT name FROM users WHERE user_id = ?", [lawyer_id]);
    const lawyer_name = lawyers[0].name;

    // Create case with approved status
    const [result] = await db.query(
      "INSERT INTO cases (title, description, lawyer_id, client_id, status, hearing_date) VALUES (?, ?, ?, ?, 'approved', ?)",
      [title, description, lawyer_id, client_id, hearing_date]
    );

    // Create notification for the client
    const notificationMessage = `You have been assigned case \"${title}\" by the lawyer ${lawyer_name}`;
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [client_id, notificationMessage]
    );

    res.status(201).json({ message: 'Case created successfully', case_id: result.insertId });
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ 
      message: 'Failed to create case',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.put("/cases/:id/approve", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const case_id = req.params.id;
    const lawyer_id = req.user.user_id;

    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can approve cases' });
    }

    // Check if the case exists and belongs to the lawyer
    const [cases] = await db.query("SELECT * FROM cases WHERE id = ? AND lawyer_id = ?", [case_id, lawyer_id]);
    if (cases.length === 0) {
      return res.status(404).json({ message: 'Case not found or you are not authorized to approve it' });
    }
    const caseToApprove = cases[0];

    // Update case status
    await db.query("UPDATE cases SET status = 'approved' WHERE id = ?", [case_id]);

    // Create notification for the client
    const notificationMessage = `Your case request for "${caseToApprove.title}" has been approved by your lawyer.`
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [caseToApprove.client_id, notificationMessage]
    );

    res.json({ message: 'Case approved successfully' });
  } catch (err) {
    console.error('Error approving case:', err);
    res.status(500).json({ 
      message: 'Failed to approve case',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.delete("/cases/:id/decline", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const case_id = req.params.id;
    const lawyer_id = req.user.user_id;

    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can decline cases' });
    }

    // Check if the case exists and belongs to the lawyer
    const [cases] = await db.query("SELECT * FROM cases WHERE id = ? AND lawyer_id = ?", [case_id, lawyer_id]);
    if (cases.length === 0) {
      return res.status(404).json({ message: 'Case not found or you are not authorized to decline it' });
    }
    const caseToDecline = cases[0];

    // Update case status to rejected
    await db.query("UPDATE cases SET status = 'rejected' WHERE id = ?", [case_id]);

    // Create notification for the client
    const notificationMessage = `Your case request for "${caseToDecline.title}" has been declined by your lawyer.`
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [caseToDecline.client_id, notificationMessage]
    );


    res.json({ message: 'Case declined successfully' });
  } catch (err) {
    console.error('Error declining case:', err);
    res.status(500).json({ 
      message: 'Failed to decline case',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.put("/cases/:id/flag", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const case_id = req.params.id;
    const lawyer_id = req.user.user_id;
    const { status } = req.body; // 'won' or 'lost'

    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can flag cases' });
    }

    if (status !== 'won' && status !== 'lost') {
      return res.status(400).json({ message: 'Invalid status. Must be \'won\' or \'lost\'' });
    }

    // Check if the case exists and belongs to the lawyer
    const [cases] = await db.query("SELECT * FROM cases WHERE id = ? AND lawyer_id = ?", [case_id, lawyer_id]);
    if (cases.length === 0) {
      return res.status(404).json({ message: 'Case not found or you are not authorized to flag it' });
    }
    const caseToFlag = cases[0];

    // Check if the case is approved
    if (caseToFlag.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved cases can be flagged' });
    }

    // Check if hearing date has passed
    const today = new Date();
    const hearingDate = new Date(caseToFlag.hearing_date);
    if (hearingDate > today) {
      return res.status(400).json({ message: 'Cannot flag case before hearing date' });
    }

    // Update case status
    await db.query("UPDATE cases SET status = ? WHERE id = ?", [status, case_id]);

    // Create notification for the client
    const notificationMessage = `Your case \"${caseToFlag.title}" has been marked as ${status} by your lawyer.`
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [caseToFlag.client_id, notificationMessage]
    );

    res.json({ message: `Case marked as ${status} successfully` });
  } catch (err) {
    console.error('Error flagging case:', err);
    res.status(500).json({ 
      message: 'Failed to flag case',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


export default router;