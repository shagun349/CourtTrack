// routes/hearings.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Add hearing
router.post("/", (req, res) => {
  const { case_id, date, notes } = req.body;
  const q = "INSERT INTO hearings (case_id, date, notes) VALUES (?, ?, ?)";

  db.query(q, [case_id, date, notes], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Hearing scheduled successfully" });
  });
});

// Get upcoming hearings
router.get("/", (req, res) => {
  const q = "SELECT * FROM hearings WHERE date >= CURDATE() ORDER BY date ASC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

export default router;
