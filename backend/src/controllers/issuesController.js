const { extractFilePaths } = require('../utils/filePaths');
class IssuesController {
  constructor(issuesService) {
    this.issuesService = issuesService;
  }

  // Create a new issue
  async createIssue(req, res, next) {
    try {
      const userId = req.userId;
      const { title, description, coordinates } = req.body;
      const photos = extractFilePaths(req.files);

      const issue = await this.issuesService.createIssue({
        userId,
        title,
        description,
        photos,
        coordinates,
      });
      res.status(201).json(issue);
    } catch (err) {
      next(err);
    }
  }

  // Get all issues for the authenticated user
  async getUserIssues(req, res, next) {
    try {
      const { userId } = req;
      const issues = await this.issuesService.getUserIssues(userId);
      res.json(issues);
    } catch (err) {
      next(err);
    }
  }

  // Get a single issue by ID (must belong to user)
  async getIssueById(req, res, next) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const issue = await this.issuesService.getIssueById(issueId, userId);
      if (!issue) return res.status(404).send("Issue not found.");
      res.json(issue);
    } catch (err) {
      next(err);
    }
  }

  // Update an issue (must belong to user)
  async updateIssue(req, res, next) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const { title, description, photos, coordinates, status } = req.body;
      const updated = await this.issuesService.updateIssue(issueId, userId, {
        title,
        description,
        photos,
        coordinates,
        status,
      });
      if (!updated)
        return res.status(404).send("Issue not found or not yours.");
      res.json({ message: "Issue updated." });
    } catch (err) {
      next(err);
    }
  }

  // Delete an issue (must belong to user)
  async deleteIssue(req, res, next) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const deleted = await this.issuesService.deleteIssue(issueId, userId);
      if (!deleted)
        return res.status(404).send("Issue not found or not yours.");
      res.json({ message: "Issue deleted." });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IssuesController;
