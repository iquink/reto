const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

class AuthService {
  constructor(db) {
    this.db = db;
  }

  async register({ username, email, password }) {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await this.db.execute(query, [username, email, hashedPassword]);
    return { message: 'User registered successfully.' };
  }

  async login({ email, password }) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results] = await this.db.execute(query, [email]);

    if (results.length === 0) {
      throw new Error('User not found.');
    }

    const user = results[0];
    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    const token = generateToken({ id: user.id, email: user.email });
    return { token, user: { username: user.username, email: user.email } };
  }

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [results] = await this.db.execute(query, [id]);

    if (results.length === 0) {
      throw new Error('User not found.');
    }

    const user = results[0];
    return { username: user.username, email: user.email };
  }
}

module.exports = AuthService;