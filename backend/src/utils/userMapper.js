const mapUserToResponse = (user) => ({
  username: user.username,
  email: user.email,
  fullName: user.full_name,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  isActive: user.is_active,
  role: user.role,
});

module.exports = { mapUserToResponse };