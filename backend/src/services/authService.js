const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
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

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const token = generateToken({ id: user.id, email: user.email });
    return {
      token,
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
}

module.exports = AuthService;