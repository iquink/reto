const mysql = require("mysql2/promise");

const MAX_RETRIES = 30; // Try for up to 1 minute (30 x 2s)
const RETRY_DELAY_MS = 2000;

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const initDB = async () => {
  let attempt = 0;
  while (true) {
    try {
      const pool = await mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      const connection = await pool.getConnection();
      connection.release();
      console.log("Connected to the MySQL database.");
      return pool;
    } catch (err) {
      attempt++;
      console.error(
        `Error connecting to the database (attempt ${attempt}):`,
        err.message
      );
      if (attempt >= MAX_RETRIES) {
        console.error("Max DB connection attempts reached. Exiting.");
        process.exit(1);
      }
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await wait(RETRY_DELAY_MS);
    }
  }
};

module.exports = initDB;
