// routes/auth.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Register user
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  const q = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(q, [name, email, password, role], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "User registered successfully!" });
  });
});

// Login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(q, [email, password], (err, data) => {
    if (err) return res.status(500).json({ error: err });
    if (data.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful", user: data[0] });
  });
});

export default router;
