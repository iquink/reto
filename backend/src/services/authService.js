const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../utils/jwt");
const { NotFoundError, UnauthorizedError, BadRequestError } = require("../utils/errors");
const UserRepository = require("../repositories/userRepository");
const { mapUserToResponse } = require("../utils/userMapper");

class AuthService {
  constructor(db) {
    this.db = db;
    this.userRepository = new UserRepository(db);
  }

  async register({ username, email, password }) {
    const existingUser = await this.userRepository.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new BadRequestError("Email or username already exists.");
    }

    const hashedPassword = await hashPassword(password);
    await this.userRepository.create({ username, email, hashedPassword });
    return { message: "User registered successfully." };
  }

  /**
   * Authenticates a user and generates both access and refresh tokens
   * 
   * @param {Object} credentials - User login credentials (email and password)
   * @returns {Object} Object containing tokens and user information
   */
  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    // Generate both tokens
    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token hash in database (optional)
    // await this.userRepository.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: mapUserToResponse(user),
    };
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return mapUserToResponse(user);
  }

  /**
   * Verifies a refresh token and generates a new access token
   * 
   * @param {string} refreshToken - The refresh token to verify
   * @returns {Object} Object containing the new access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify the refresh token using the refresh token secret
      const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Find the user
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new NotFoundError("User not found.");
      }

      // Generate a new access token
      const payload = { id: user.id, email: user.email };
      const accessToken = generateAccessToken(payload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token.");
    }
  }
}

module.exports = AuthService;