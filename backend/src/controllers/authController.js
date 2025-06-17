const { verifyToken } = require("../utils/jwt");
const { UnauthorizedError } = require("../utils/errors");

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
        const { accessToken, refreshToken, user } = await this.authService.login(req.body);
        
        // Set access token in httpOnly cookie
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
        
        // Set refresh token in a separate httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/refresh-token', // Restrict to refresh endpoint only
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        const csrfToken = req.csrfToken;
        
        res.json({ 
          message: 'Login successful.', 
          user,
          csrfToken
        });
      } catch (err) {
        next(err);
      }
    }
  
    async logout(req, res) {
      // Clear both tokens
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/refresh-token',
      });

      res.status(200).send('Logout successful.');
    }
  
    async checkAuth(req, res) {
      res.json({ message: 'Access granted.', user: req.user });
    }
  
    async getUser(req, res, next) {
      try {
        const userId = req.userId;
        const user = await this.authService.getUserById(userId);
        res.json(user);
      } catch (err) {
        next(err);
      }
    }

    /**
     * Refreshes an expired access token using a valid refresh token
     * 
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async refreshAccessToken(req, res, next) {
      try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
          throw new UnauthorizedError("Refresh token not provided");
        }

        const { accessToken } = await this.authService.refreshToken(refreshToken);

        // Set new access token in httpOnly cookie
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Generate a new CSRF token for enhanced security
        const csrfToken = req.csrfToken;

        res.json({
          message: 'Token refreshed successfully',
          csrfToken
        });
      } catch (err) {
        next(err);
      }
    }
  }

module.exports = AuthController;