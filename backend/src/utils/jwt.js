const jwt = require('jsonwebtoken');

/**
 * Generates a short-lived access token for API authorization
 * 
 * @param {Object} payload - User data to encode in the token
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Generates a long-lived refresh token for obtaining new access tokens
 * 
 * @param {Object} payload - Minimal user data (usually just the ID)
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  // Only include the bare minimum in refresh tokens
  const refreshPayload = { id: payload.id };
  return jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

/**
 * Verifies the validity of a JWT token
 * 
 * @param {string} token - The JWT token to verify
 * @param {string} secret - Secret key used to verify the token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};

module.exports = { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyToken 
};