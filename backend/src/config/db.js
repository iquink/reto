const mysql = require("mysql2/promise");

const initDB = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    const connection = await pool.getConnection();
    connection.release();

    return pool;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  finally {
    console.log("Connected to the MySQL database.");
  }
};

module.exports = initDB;
