// db.js (The final, robust version)
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool; // Define pool in the outer scope so we can export it

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Make sure this matches your Railway variable
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log("✅ MySQL Pool created successfully.");

  // Test the connection on startup
  pool.getConnection()
    .then(connection => {
      console.log("✅ Database connection test successful.");
      connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
      // This will log a specific error if the test fails but won't crash the app
      console.error("🔥 DATABASE STARTUP CONNECTION TEST FAILED:", err.message);
    });

} catch (error) {
  // This will catch any fatal errors if the pool creation itself fails
  console.error("🔥🔥 FATAL ERROR: Could not create MySQL Pool:", error.message);
}

export default pool;