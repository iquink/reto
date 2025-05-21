class AuthController {
    constructor(authService) {
      this.authService = authService;
    }
  
    async register(req, res) {
      try {
        const result = await this.authService.register(req.body);
        res.status(201).json(result);
      } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user.');
      }
    }
  
    async login(req, res) {
      try {
        const { token, user } = await this.authService.login(req.body);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        res.json({ message: 'Login successful.', user });
      } catch (err) {
        console.error('Error logging in:', err);
        res.status(err.message === 'User not found.' ? 404 : 401).send(err.message);
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
        const user = await this.authService.getUserById(req.user.id);
        res.json(user);
      } catch (err) {
        console.error('Error fetching user:', err);
        res.status(404).send(err.message);
      }
    }
  }
  
  module.exports = AuthController;