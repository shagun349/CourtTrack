

// server.js
import express from "express";
import cors from "cors";
import { dbPromise } from "./db.js";
import caseRoutes from "./routes/cases.js";
import judgeRoutes from "./routes/judges.js";
import userRoutes from "./routes/users.js";

import notificationRoutes from "./routes/notifications.js";
import lawyerRoutes from "./routes/lawyers.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use("/api", caseRoutes);
app.use("/api", judgeRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", notificationRoutes);
app.use("/api", lawyerRoutes);

// Test route
app.get("/", (req, res) => {
  // Test database connection (use promise pool)
  dbPromise
    .then((db) => db.query('SELECT 1'))
    .then(() => res.send("CourtTrack Backend Running ✅ (Database Connected)"))
    .catch((err) => {
      console.error("Database connection test failed:", err);
      res.status(500).json({ 
        message: "Database connection error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const port = process.env.PORT || 5000;

// Start the server only after DB is initialized
dbPromise
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server because DB initialization failed:', err);
    process.exit(1);
  });