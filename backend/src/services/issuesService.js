const { BadRequestError, NotFoundError } = require("../utils/errors");
const IssuesRepository = require("../repositories/issuesRepository");

class IssuesService {
  constructor(db) {
    this.db = db;
    this.issuesRepository = new IssuesRepository(db);
  }

  async createIssue({ userId, title, description, photos, coordinates }) {
    const parsedUserId = Number(userId);
    if (
      isNaN(parsedUserId) ||
      !Number.isInteger(parsedUserId) ||
      parsedUserId <= 0
    ) {
      throw new BadRequestError(
        `Invalid user_id: must be a positive integer, received ${userId} (type: ${typeof userId})`
      );
    }
    if (!title || typeof title !== "string" || title.length > 255) {
      throw new BadRequestError(
        "Invalid title: must be a non-empty string up to 255 characters"
      );
    }
    if (description && typeof description !== "string") {
      throw new BadRequestError(
        "Invalid description: must be a string or null"
      );
    }
    if (photos && !Array.isArray(photos) && typeof photos !== "object") {
      throw new BadRequestError(
        "Invalid photos: must be an array, object, or null"
      );
    }
    if (!coordinates || typeof coordinates !== "string") {
      throw new BadRequestError("Invalid coordinates: must be a string");
    }
    const normalizedCoordinates = coordinates.replace(",", " ").trim();
    if (!normalizedCoordinates.match(/^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/)) {
      throw new BadRequestError(
        'Invalid coordinates: must be in format "longitude latitude" or "longitude,latitude"'
      );
    }
    const [longitude, latitude] = normalizedCoordinates.split(" ").map(Number);
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new BadRequestError(
        "Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90"
      );
    }
    const pointWKT = `POINT(${longitude} ${latitude})`;
    try {
      const insertId = await this.issuesRepository.create({
        userId: parsedUserId,
        title,
        description,
        photos,
        coordinates: pointWKT,
      });
      const newIssue = await this.issuesRepository.findById(insertId);
      if (!newIssue) {
        throw new NotFoundError("Failed to retrieve created issue");
      }

      return newIssue;
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new NotFoundError("Invalid user_id: user does not exist");
      }
      throw error;
    }
  }

  async getUserIssues(userId) {
    const rows = await this.issuesRepository.findByUserId(userId);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      updated_at: row.updated_at,
      status: row.status,
    }));
  }

  async getIssueById(id, userId) {
    const queryResult = await this.issuesRepository.findById(id);
    if (!queryResult || queryResult.user_id != userId) return null;
    const row = queryResult;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      photos: row.photos ? row.photos : null,
      coordinates: row.coordinates,
      created_at: row.created_at,
      updated_at: row.updated_at,
      status: row.status,
    };
  }

  async updateIssue(
    id,
    userId,
    { title, description, photos, coordinates, status }
  ) {
    // Only update fields that are provided
    const fields = {};
    if (title !== undefined) fields.title = title;
    if (description !== undefined) fields.description = description;
    if (photos !== undefined)
      fields.photos = photos ? JSON.stringify(photos) : null;
    if (coordinates !== undefined) fields.coordinates = coordinates;
    if (status !== undefined) {
      const allowedStatuses = ["open", "in_progress", "closed"];
      if (!allowedStatuses.includes(status)) {
        throw new BadRequestError(
          `Invalid status: must be one of ${allowedStatuses.join(", ")}`
        );
      }
      fields.status = status;
    }
    if (Object.keys(fields).length === 0) return false;
    try {
      return await this.issuesRepository.update(id, userId, fields);
    } catch (error) {
      console.error("DB error in updateIssue:", error);
      throw error;
    }
  }

  async deleteIssue(id, userId) {
    return await this.issuesRepository.delete(id, userId);
  }
}

module.exports = IssuesService;
