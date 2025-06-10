const express = require("express");
const path = require("path");
const FileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/images/:filename", authMiddleware, FileController.serveImage.bind(FileController));

module.exports = router;