class IssuesService {
  constructor(db) {
    this.db = db;
  }

  async createIssue({ userId, title, description, photos, coordinates }) {
    // Input to createIssue
    console.log("Input to createIssue:", {
      user_id: userId,
      title,
      description,
      photos,
      coordinates,
    });
    console.log("user_id type:", typeof userId, "user_id value:", userId);

    // Convert user_id to number
    const parsedUserId = Number(userId);
    if (
      isNaN(parsedUserId) ||
      !Number.isInteger(parsedUserId) ||
      parsedUserId <= 0
    ) {
      throw new Error(
        `Invalid user_id: must be a positive integer, received ${userId} (type: ${typeof userId})`
      );
    }

    // Title validation
    if (!title || typeof title !== "string" || title.length > 255) {
      throw new Error(
        "Invalid title: must be a non-empty string up to 255 characters"
      );
    }

    // Description validation
    if (description && typeof description !== "string") {
      throw new Error("Invalid description: must be a string or null");
    }

    // Photos validation
    if (photos && !Array.isArray(photos) && typeof photos !== "object") {
      throw new Error("Invalid photos: must be an array, object, or null");
    }

    // Coordinates validation
    if (!coordinates || typeof coordinates !== "string") {
      throw new Error("Invalid coordinates: must be a string");
    }
    const normalizedCoordinates = coordinates.replace(",", " ").trim();
    if (!normalizedCoordinates.match(/^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/)) {
      throw new Error(
        'Invalid coordinates: must be in format "longitude latitude" or "longitude,latitude"'
      );
    }

    // Split coordinates
    const [longitude, latitude] = normalizedCoordinates.split(" ").map(Number);
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new Error(
        "Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90"
      );
    }

    // SQL query
    const query = `
    INSERT INTO issues (user_id, title, description, photos, coordinates)
    VALUES (?, ?, ?, ?, ST_GeomFromText(?, 4326))
  `;
    const photosJson = photos ? JSON.stringify(photos) : null;
    const pointWKT = `POINT(${longitude} ${latitude})`;

    try {
      const [result] = await this.db.execute(query, [
        parsedUserId,
        title,
        description || null,
        photosJson,
        pointWKT,
      ]);

      return {
        id: result.insertId,
        user_id: parsedUserId,
        title,
        description: description || null,
        photos: photos || null,
        coordinates: { longitude, latitude },
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error("Invalid user_id: user does not exist");
      }
      throw error;
    }
  }

  async getUserIssues(userId) {
    const query = `SELECT * FROM issues WHERE user_id = ? ORDER BY updated_at DESC`;
    const [rows] = await this.db.execute(query, [userId]);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      updated_at: row.updated_at,
      status: row.status,
    }));
  }

  async getIssueById(id, userId) {
    const query = `SELECT * FROM issues WHERE id = ? AND user_id = ?`;
    const [rows] = await this.db.execute(query, [id, userId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      photos: row.photos ? JSON.parse(row.photos) : null,
      coordinates: row.coordinates,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  async updateIssue(id, userId, { title, description, photos, coordinates }) {
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

    values.push(id, userId);
    const query = `UPDATE issues SET ${fields.join(
      ", "
    )} WHERE id = ? AND user_id = ?`;
    const [result] = await this.db.execute(query, values);
    return result.affectedRows > 0;
  }

  async deleteIssue(id, userId) {
    const query = `DELETE FROM issues WHERE id = ? AND user_id = ?`;
    const [result] = await this.db.execute(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = IssuesService;
