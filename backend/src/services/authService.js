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
   * Authenticates a user and generates both access and refresh tokens.
   * The refresh token is hashed with Argon2 before being persisted so that
   * a database breach cannot be used to forge new sessions.
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

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash the refresh token before storage — raw token is only ever sent to the client
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.userRepository.saveRefreshToken(user.id, hashedRefreshToken);

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
   * Verifies a refresh token and generates a new access token.
   * Two checks are performed:
   *   1. Cryptographic signature via JWT (prevents tampering).
   *   2. Hash comparison against the stored value (detects revoked/stolen tokens).
   */
  async refreshToken(refreshToken) {
    let decoded;
    try {
      decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Reject if no token is stored (user has logged out or token was revoked)
    if (!user.refresh_token) {
      throw new UnauthorizedError("Refresh token has been revoked.");
    }

    // Verify the presented token matches the hash on record
    const isValid = await verifyPassword(user.refresh_token, refreshToken);
    if (!isValid) {
      // Potential token theft — clear the stored token to force re-login
      await this.userRepository.deleteRefreshToken(user.id);
      throw new UnauthorizedError("Refresh token mismatch. All sessions invalidated.");
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);

    return { accessToken };
  }

  /**
   * Revokes the stored refresh token for a user, preventing any further
   * token refresh calls from succeeding (server-side logout).
   */
  async logout(userId) {
    await this.userRepository.deleteRefreshToken(userId);
  }
}

module.exports = AuthService;