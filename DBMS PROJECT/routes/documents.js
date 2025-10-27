import express from "express";
const router = express.Router();
import db from "../db.js"; // or wherever you connected MySQL

// GET all documents
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM documents");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching documents" });
  }
});

export default router;
