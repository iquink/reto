class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await this.db.execute(query, [email]);
    return results[0] || null;
  }

  async findById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const [results] = await this.db.execute(query, [id]);
    return results[0] || null;
  }

  async findByEmailOrUsername(email, username) {
    const query = "SELECT id FROM users WHERE email = ? OR username = ?";
    const [results] = await this.db.execute(query, [email, username]);
    return results[0] || null;
  }

  async create({ username, email, hashedPassword }) {
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await this.db.execute(query, [username, email, hashedPassword]);
  }

  async getUsersList() {
    const query = `
      SELECT *
      FROM users
      ORDER BY created_at DESC
    `;
    const [results] = await this.db.execute(query);
    return results;
  }

  async isAdmin(userId) {
    const query = "SELECT role FROM users WHERE id = ?";
    const [results] = await this.db.execute(query, [userId]);
    if (results.length === 0) return false;
    return results[0].role === "admin";
  }
}

module.exports = UserRepository;
