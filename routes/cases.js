// routes/cases.js
import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/cases", (req, res) => {
  db.query("SELECT * FROM cases", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

export default router;