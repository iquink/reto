const path = require("path");
const fs = require("fs/promises");

// Resolve the uploads directory once at module load time so the boundary
// is a fixed, canonical absolute path (no symlink / relative-segment tricks).
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

class FileController {
  constructor() {}

  async serveImage(req, res) {
    const { filename } = req.params;

    // Resolve the requested path to its canonical absolute form.
    const filePath = path.resolve(UPLOADS_DIR, filename);

    // Path-traversal guard: the resolved path MUST remain inside UPLOADS_DIR.
    // A trailing separator is appended so that a directory whose name is a
    // prefix of another cannot accidentally satisfy the check.
    if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
      return res.status(403).json({ error: "Forbidden" });
    }

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