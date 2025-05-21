const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    // Add user data to the request
    next();
  } catch (err) {
    res.status(401).send('Invalid token.');
  }
};

module.exports = authMiddleware;