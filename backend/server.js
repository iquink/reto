const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Use environment variable for host
  user: process.env.DB_USER, // Use environment variable for user
  password: process.env.DB_PASSWORD, // Use environment variable for password
  database: process.env.DB_NAME, // Use environment variable for database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Routes
// Register a new user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Error registering user.");
        return;
      }
      res.status(201).send("User registered successfully.");
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send("Error registering user.");
  }
});

// Login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).send("Error logging in.");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("User not found.");
      return;
    }

    const user = results[0];

    try {
      // Verify the password
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        res.status(401).send("Invalid credentials.");
        return;
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful.", token });
    } catch (err) {
      console.error("Error verifying password:", err);
      res.status(500).send("Error logging in.");
    }
  });
});

// Protected route example
app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Access granted.", user: decoded });
  } catch (err) {
    res.status(401).send("Invalid token.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});