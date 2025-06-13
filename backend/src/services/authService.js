const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");

class AuthService {
  constructor(db) {
    this.db = db;
  }

  async register({ username, email, password }) {
    // Check for duplicate email or username
    const checkQuery = "SELECT id FROM users WHERE email = ? OR username = ?";
    const [existing] = await this.db.execute(checkQuery, [email, username]);
    if (existing.length > 0) {
      throw new BadRequestError("Email or username already exists.");
    }
    const hashedPassword = await hashPassword(password);
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await this.db.execute(query, [username, email, hashedPassword]);
    return { message: "User registered successfully." };
  }

  async login({ email, password }) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await this.db.execute(query, [email]);

    if (results.length === 0) {
      throw new NotFoundError("User not found.");
    }

    const user = results[0];
    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const token = generateToken({ id: user.id, email: user.email });
    return { token, user: { username: user.username, email: user.email } };
  }

  async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const [results] = await this.db.execute(query, [id]);

    if (results.length === 0) {
      throw new NotFoundError("User not found.");
    }

    const user = results[0];
    return { username: user.username, email: user.email };
  }
}

module.exports = AuthService;
