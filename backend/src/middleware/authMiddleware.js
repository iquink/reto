const { verifyToken } = require("../utils/jwt");
const { UnauthorizedError } = require("../utils/errors");

/**
 * Middleware that verifies if the request has a valid access token
 * If valid, adds the user ID to the request object
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new UnauthorizedError("Access denied. No token provided."));
  }

  try {
    const decoded = verifyToken(token);
    // Add user data to the request
    req.userId = decoded.id;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token."));
  }
};

module.exports = authMiddleware;
