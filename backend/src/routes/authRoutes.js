const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

module.exports = (authService, generateCsrfToken) => {
  const authController = new AuthController(authService);

  router.post('/register', authController.register.bind(authController));
  router.post('/login', generateCsrfToken, authController.login.bind(authController));
  router.post('/logout', authController.logout.bind(authController));
  router.post('/refresh-token', generateCsrfToken, authController.refreshAccessToken.bind(authController));
  router.get('/check-auth', authMiddleware, authController.checkAuth.bind(authController));
  router.get('/get-user', authMiddleware, authController.getUser.bind(authController));

  return router;
};