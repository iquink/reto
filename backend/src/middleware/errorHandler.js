const { CustomError } = require("../utils/errors");

const errorHandler = (error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${error.constructor.name}:`, error.message);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }

  res.status(500).json({ error: "Internal server error." });
};

module.exports = errorHandler;