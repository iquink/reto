const crypto = require("crypto");
const { ForbiddenError } = require("../utils/errors");

/**
 * Array of authentication-related route substrings that are exempt from CSRF validation.
 * @type {string[]}
 */
const CSRF_EXEMPT_PATHS = ["/login", "/register", "/refresh-token", "/logout"];

/**
 * Determines if a route is unsafe and requires CSRF validation.
 * Returns true for routes that are NOT in the CSRF_EXEMPT_PATHS list.
 *
 * @param {string} path - Express request path
 * @returns {boolean} True if the route requires CSRF validation, false otherwise.
 */
function isUnsafeRoute(path) {
  return !CSRF_EXEMPT_PATHS.some((exemptPath) => path.includes(exemptPath));
}

// CSRF-token generation on login
const generateCsrfToken = (req, res, next) => {
  const csrfToken = crypto.randomBytes(16).toString("hex");

  // Set the token in a cookie accessible to JavaScript on the client
  res.cookie("csrf-token", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  // Add the token to the request object so it can be used in the controller
  req.csrfToken = csrfToken;
  next();
};

/**
 * Express middleware to validate CSRF tokens for unsafe routes and modifying HTTP methods.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const validateCsrfToken = (req, res, next) => {
  if (
    ["POST", "PUT", "DELETE", "PATCH"].includes(req.method) &&
    isUnsafeRoute(req.path)
  ) {
    const csrfCookie = req.cookies["csrf-token"];
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return next(new ForbiddenError("CSRF protection validation failed"));
    }
  }

  next();
};

module.exports = {
  generateCsrfToken,
  validateCsrfToken,
  isUnsafeRoute,
  CSRF_EXEMPT_PATHS,
};
