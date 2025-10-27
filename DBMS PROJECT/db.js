import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",           // apna MySQL username daal
  password: "nealatul1@", // apna password
  database: "courttrack_db"  // tu MySQL me ye database bana le
});

db.connect(err => {
  if (err) console.log("❌ MySQL Connection Failed", err);
  else console.log("✅ MySQL Connected Successfully");
});
