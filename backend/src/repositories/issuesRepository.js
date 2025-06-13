class IssuesRepository {
  constructor(db) {
    this.db = db;
  }

  async findById(id) {
    const query = 'SELECT * FROM issues WHERE id = ?';
    const [results] = await this.db.execute(query, [id]);
    return results[0] || null;
  }

  async findByUserId(userId) {
    const query = 'SELECT * FROM issues WHERE user_id = ? ORDER BY updated_at DESC';
    const [results] = await this.db.execute(query, [userId]);
    return results;
  }

  async create({ userId, title, description, photos, coordinates }) {
    const query = `
      INSERT INTO issues (user_id, title, description, photos, coordinates)
      VALUES (?, ?, ?, ?, ST_GeomFromText(?, 4326))
    `;
    const photosJson = photos ? JSON.stringify(photos) : null;
    const pointWKT = coordinates; // Should be in WKT format already
    const [result] = await this.db.execute(query, [
      userId,
      title,
      description || null,
      photosJson,
      pointWKT,
    ]);
    return result.insertId;
  }

  async update(id, userId, fields) {
    const setFields = [];
    const values = [];
    for (const [key, value] of Object.entries(fields)) {
      setFields.push(`${key} = ?`);
      values.push(value);
    }
    if (setFields.length === 0) return false;
    setFields.push('updated_at = NOW()');
    values.push(id, userId);
    const query = `UPDATE issues SET ${setFields.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await this.db.execute(query, values);
    return result.affectedRows > 0;
  }

  async delete(id, userId) {
    const query = 'DELETE FROM issues WHERE id = ? AND user_id = ?';
    const [result] = await this.db.execute(query, [id, userId]);
    return result.affectedRows > 0;
  }

  async getAll() {
    const query = 'SELECT * FROM issues ORDER BY created_at DESC';
    const [results] = await this.db.execute(query);
    return results;
  }
}

module.exports = IssuesRepository;
