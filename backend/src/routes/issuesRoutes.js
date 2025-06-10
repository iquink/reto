const express = require('express');
const IssuesController = require('../controllers/issuesController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

module.exports = (issuesService) => {
  const issuesController = new IssuesController(issuesService);

  router.post(
    '/', 
    authMiddleware, 
    uploadMiddleware.array('files', 3), // Limit to 3 files
    issuesController.createIssue.bind(issuesController));
  router.get('/', authMiddleware, issuesController.getUserIssues.bind(issuesController));
  router.get('/:id', authMiddleware, issuesController.getIssueById.bind(issuesController));
  router.put('/:id', authMiddleware, issuesController.updateIssue.bind(issuesController));
  router.delete('/:id', authMiddleware, issuesController.deleteIssue.bind(issuesController));

  return router;
};