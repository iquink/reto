const { verifyToken } = require("../utils/jwt");

class AuthController {
    constructor(authService) {
      this.authService = authService;
    }
  
    async register(req, res, next) {
      try {
        const result = await this.authService.register(req.body);
        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    }
  
    async login(req, res, next) {
      try {
        const { token, user } = await this.authService.login(req.body);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        res.json({ message: 'Login successful.', user });
      } catch (err) {
        next(err);
      }
    }
  
    async logout(req, res) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(200).send('Logout successful.');
    }
  
    async checkAuth(req, res) {
      res.json({ message: 'Access granted.', user: req.user });
    }
  
    async getUser(req, res) {
      try {
        const token = req.cookies.token; // Get the token from the cookie
        const decoded = verifyToken(token);
        const user = await this.authService.getUserById(decoded.id);
        res.json(user);
      } catch (err) {
        next(err);
      }
    }
  }
  
  module.exports = AuthController;