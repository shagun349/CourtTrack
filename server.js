

// server.js
import express from "express";
import cors from "cors";
import { db } from "./db.js";
import caseRoutes from "./routes/cases.js";

const app = express();
app.use(cors());
app.use(express.json());

// route prefix
app.use("/api", caseRoutes);

// test route
app.get("/", (req, res) => {
  res.send("CourtTrack Backend Running ✅");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));