// routes/cases.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all cases
router.get("/", (req, res) => {
  const q = `
    SELECT c.*, u.name AS client_name 
    FROM cases c 
    JOIN users u ON c.client_id = u.user_id
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

// Add a new case
router.post("/", (req, res) => {
  const { title, description, status, filed_date, client_id } = req.body;

  const q = "INSERT INTO cases (title, description, status, filed_date, client_id) VALUES (?, ?, ?, ?, ?)";
  db.query(q, [title, description, status, filed_date, client_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Case added successfully" });
  });
});

// Get specific case
router.get("/:id", (req, res) => {
  const q = `
    SELECT c.*, u.name AS client_name 
    FROM cases c 
    JOIN users u ON c.client_id = u.user_id 
    WHERE c.case_id = ?
  `;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data[0]);
  });
});

export default router;
