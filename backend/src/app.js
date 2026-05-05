const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// helmet sets a suite of security-focused HTTP response headers (CSP, HSTS, X-Frame-Options, etc.)
const helmet = require('helmet');
// express-rate-limit throttles repeated requests from the same IP to mitigate brute-force attacks
const { rateLimit } = require('express-rate-limit');
const initDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const AuthService = require('./services/authService');
const IssuesService = require('./services/issuesService');
const issuesRoutes = require('./routes/issuesRoutes');
const filesRoutes = require('./routes/filesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const UsersService = require('./services/usersService');
const UserRepository = require('./repositories/userRepository');
const IssuesRepository = require('./repositories/issuesRepository');
const errorHandler = require('./middleware/errorHandler');
const { validateCsrfToken, generateCsrfToken } = require('./middleware/csrfMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter for authentication endpoints — prevents brute-force attacks on
// login, registration, and token-refresh by capping each IP to 10 requests
// per 15-minute sliding window.
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: 'draft-8', // Return rate-limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

(async () => {
  // Database initialization
  const db = await initDB();

  // Repository instantiation — the only layer that holds the db connection
  const userRepository = new UserRepository(db);
  const issuesRepository = new IssuesRepository(db);

  // Service instantiation with injected repositories
  const authService = new AuthService(userRepository);
  const issuesService = new IssuesService(issuesRepository);
  const usersService = new UsersService(userRepository);

  // Security headers — applied before any route handler
  app.use(helmet());

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_HOST || 'http://localhost:5173',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
  );

  // Limit request body size to 10 kb to prevent payload-exhaustion (DoS) attacks
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use(validateCsrfToken);

  // Apply auth rate limiter only to the endpoints vulnerable to brute-force
  app.use(['/login', '/register', '/refresh-token'], authRateLimit);

  // Routes
  app.use('/', authRoutes(authService, generateCsrfToken));
  app.use('/issues', issuesRoutes(issuesService));
  app.use("/", filesRoutes);
  app.use('/users', usersRoutes(usersService));

  app.use(errorHandler);

  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown — finish in-flight requests before exiting
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await db.end();
        console.log('Database connection pool closed.');
      } catch (err) {
        console.error('Error closing database pool:', err.message);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
})();