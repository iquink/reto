const path = require("path");
const fs = require("fs/promises");

class FileController {
  constructor() {}

  async serveImage(req, res) {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../uploads", filename);
    try {
      await fs.access(filePath);
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ error: "Failed to send file" });
        }
      });
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  }
}

module.exports = new FileController();