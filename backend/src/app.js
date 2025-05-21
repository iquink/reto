const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const AuthService = require('./services/authService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  // Database initialization
  const db = await initDB();

  // Service initialization
  const authService = new AuthService(db);

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_HOST || 'http://localhost:5173',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
  );
//   app.options('*', cors());
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use('/', authRoutes(authService));

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).send('Internal Server Error');
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();