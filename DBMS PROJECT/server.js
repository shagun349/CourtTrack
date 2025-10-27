import express from "express";
import mysql from "mysql2";
import cors from "cors";

import documentsRoutes from "./routes/documents.js";
app.use("/api/documents", documentsRoutes);


const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nealatul1@",
  database: "courttrack_db",
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected Successfully");
});

// APIs
app.get("/api/cases", (req, res) => {
  db.query("SELECT * FROM cases", (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.get("/api/documents", (req, res) => {
  db.query("SELECT * FROM documents", (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.get("/api/hearings", (req, res) => {
  db.query("SELECT * FROM hearings", (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
