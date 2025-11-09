

import mysql from "mysql2/promise";

// Create and initialize the database connection
const initDb = async () => {
  try {
    // First create database if it doesn't exist
    const initConnection = await mysql.createConnection({
      host: "",
      user: "root",
      password: "Nischay28#"
    });

    await initConnection.query('CREATE DATABASE IF NOT EXISTS courttrack');
    await initConnection.end();

    // Create the main connection pool
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "Nischay28#",
      database: "courttrack",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    await pool.query('SELECT 1');
    console.log("✅ MySQL Connected Successfully");
    
    return pool;
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err);
    throw err;
  }
};

// Export the promise of a connection pool
const dbPromise = initDb();

export { dbPromise };