const crypto = require("crypto");
const { ForbiddenError } = require("../utils/errors");

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

// CSRF token validation for modifying requests
const validateCsrfToken = (req, res, next) => {
  // For methods that modify data
  if (
    ["POST", "PUT", "DELETE", "PATCH"].includes(req.method) &&
    !req.path.includes("/login") &&
    !req.path.includes("/register")
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
};
