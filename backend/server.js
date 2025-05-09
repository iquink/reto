const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_HOST, // Allow requests from the frontend URL
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json()); // Use express.json() instead of bodyParser
app.use(require("cookie-parser")()); // Add cookie-parser middleware

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
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        res.status(401).send("Invalid credentials.");
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
      });

      res.json({
        message: "Login successful.",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("Error verifying password:", err);
      res.status(500).send("Error logging in.");
    }
  });
});

// Protected route example
app.get("/protected", (req, res) => {
  const token = req.cookies.token; // Get the token from the cookie

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
