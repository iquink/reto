const { extractFilePaths } = require('../utils/filePaths');
class IssuesController {
  constructor(issuesService) {
    this.issuesService = issuesService;
  }

  // Create a new issue
  async createIssue(req, res) {
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
      console.log("data", req.body);
      console.error("Error creating issue:", err);
      res.status(500).send("Error creating issue.");
    }
  }

  // Get all issues for the authenticated user
  async getUserIssues(req, res) {
    try {
      const { userId } = req;
      const issues = await this.issuesService.getUserIssues(userId);
      res.json(issues);
    } catch (err) {
      console.error("Error fetching issues:", err);
      res.status(500).send("Error fetching issues.");
    }
  }

  // Get a single issue by ID (must belong to user)
  async getIssueById(req, res) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const issue = await this.issuesService.getIssueById(issueId, userId);
      if (!issue) return res.status(404).send("Issue not found.");
      res.json(issue);
    } catch (err) {
      console.error("Error fetching issue:", err);
      res.status(500).send("Error fetching issue.");
    }
  }

  // Update an issue (must belong to user)
  async updateIssue(req, res) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const { title, description, photos, coordinates } = req.body;
      const updated = await this.issuesService.updateIssue(issueId, userId, {
        title,
        description,
        photos,
        coordinates,
      });
      if (!updated)
        return res.status(404).send("Issue not found or not yours.");
      res.json({ message: "Issue updated." });
    } catch (err) {
      console.error("Error updating issue:", err);
      res.status(500).send("Error updating issue.");
    }
  }

  // Delete an issue (must belong to user)
  async deleteIssue(req, res) {
    try {
      const { userId } = req;
      const issueId = req.params.id;
      const deleted = await this.issuesService.deleteIssue(issueId, userId);
      if (!deleted)
        return res.status(404).send("Issue not found or not yours.");
      res.json({ message: "Issue deleted." });
    } catch (err) {
      console.error("Error deleting issue:", err);
      res.status(500).send("Error deleting issue.");
    }
  }
}

module.exports = IssuesController;
