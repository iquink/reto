class IssuesService {
  constructor(db) {
    this.db = db;
  }

  async createIssue({ user_id, title, description, photos, coordinates }) {
    const query = `
      INSERT INTO issues (user_id, title, description, photos, coordinates)
      VALUES (?, ?, ?, ?, ?)
    `;
    const photosJson = photos ? JSON.stringify(photos) : null;
    const [result] = await this.db.execute(query, [
      user_id,
      title,
      description,
      photosJson,
      coordinates,
    ]);
    return {
      id: result.insertId,
      user_id,
      title,
      description,
      photos,
      coordinates,
    };
  }

  async getUserIssues(user_id) {
    const query = `SELECT * FROM issues WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await this.db.execute(query, [user_id]);
    return rows.map((row) => ({
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : null,
    }));
  }

  async getIssueById(id, user_id) {
    const query = `SELECT * FROM issues WHERE id = ? AND user_id = ?`;
    const [rows] = await this.db.execute(query, [id, user_id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : null,
    };
  }

  async updateIssue(id, user_id, { title, description, photos, coordinates }) {
    // Only update fields that are provided
    const fields = [];
    const values = [];
    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (photos !== undefined) {
      fields.push("photos = ?");
      values.push(photos ? JSON.stringify(photos) : null);
    }
    if (coordinates !== undefined) {
      fields.push("coordinates = ?");
      values.push(coordinates);
    }
    if (fields.length === 0) return false;

    values.push(id, user_id);
    const query = `UPDATE issues SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`;
    const [result] = await this.db.execute(query, values);
    return result.affectedRows > 0;
  }

  async deleteIssue(id, user_id) {
    const query = `DELETE FROM issues WHERE id = ? AND user_id = ?`;
    const [result] = await this.db.execute(query, [id, user_id]);
    return result.affectedRows > 0;
  }
}

module.exports = IssuesService;