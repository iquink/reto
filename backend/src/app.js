const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const AuthService = require('./services/authService');
const IssuesService = require('./services/issuesService');
const issuesRoutes = require('./routes/issuesRoutes');
const filesRoutes = require('./routes/filesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const UsersService = require('./services/usersService');
const errorHandler = require('./middleware/errorHandler');
const { validateCsrfToken, generateCsrfToken } = require('./middleware/csrfMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  // Database initialization
  const db = await initDB();

  // Service initialization
  const authService = new AuthService(db);
  const issuesService = new IssuesService(db);
  const usersService = new UsersService(db);

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_HOST || 'http://localhost:5173',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(validateCsrfToken);

  // Routes
  app.use('/', authRoutes(authService, generateCsrfToken));
  app.use('/issues', issuesRoutes(issuesService));
  app.use("/", filesRoutes);
  app.use('/users', usersRoutes(usersService));

  app.use(errorHandler);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();