const { ForbiddenError, NotFoundError } = require("../utils/errors");
const UserRepository = require("../repositories/userRepository");
const { mapUserToResponse } = require("../utils/userMapper");

class UsersService {
  constructor(db) {
    this.db = db;
    this.userRepository = new UserRepository(db)
  }

  async getUsersList(userId) {
    const isAdmin = await this.userRepository.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenError("Access denied. Only admin can view users list.");
    }

    const results = await this.userRepository.getUsersList();

    if (results.length === 0) {
      throw new NotFoundError("Users not found.");
    }

    return results.map(mapUserToResponse);
  }
}

module.exports = UsersService;
