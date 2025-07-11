const argon2 = require('argon2');

const hashPassword = async (password) => {
  return argon2.hash(password);
};

const verifyPassword = async (hashedPassword, password) => {
  return argon2.verify(hashedPassword, password);
};

module.exports = { hashPassword, verifyPassword };