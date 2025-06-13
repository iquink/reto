const { ForbiddenError, NotFoundError } = require("../utils/errors");

class UsersService {
  constructor(db) {
    this.db = db;
  }

  async getUsersList(userId) {
    const [userRows] = await this.db.execute("SELECT role FROM users WHERE id = ?", [userId]);
    if (!userRows.length || userRows[0].role !== "admin") {
      throw new ForbiddenError("Access denied. Only admin can view users list.");
    }
    const query =
      "SELECT username, email, full_name, created_at, updated_at, is_active, role FROM users";
    const [results] = await this.db.execute(query);

    if (results.length === 0) {
      throw new NotFoundError("Users not found.");
    }

    return results;
  }
}

module.exports = UsersService;
