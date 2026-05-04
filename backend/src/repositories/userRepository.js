class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(email) {
    // Explicit column list prevents accidental leakage of new sensitive fields
    const query = `
      SELECT id, username, email, password, full_name, created_at, updated_at, is_active, role, refresh_token
      FROM users WHERE email = ?
    `;
    const [results] = await this.db.execute(query, [email]);
    return results[0] || null;
  }

  async findById(id) {
    // Explicit column list prevents accidental leakage of new sensitive fields
    const query = `
      SELECT id, username, email, password, full_name, created_at, updated_at, is_active, role, refresh_token
      FROM users WHERE id = ?
    `;
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
    // Exclude password and refresh_token — never expose these in list responses
    const query = `
      SELECT id, username, email, full_name, created_at, updated_at, is_active, role
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

  // Store a hashed refresh token so the server can later verify or revoke it
  async saveRefreshToken(userId, hashedToken) {
    const query = "UPDATE users SET refresh_token = ? WHERE id = ?";
    await this.db.execute(query, [hashedToken, userId]);
  }

  // Revoke the refresh token by nulling it out (used on logout)
  async deleteRefreshToken(userId) {
    const query = "UPDATE users SET refresh_token = NULL WHERE id = ?";
    await this.db.execute(query, [userId]);
  }
}

module.exports = UserRepository;
