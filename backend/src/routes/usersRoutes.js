const express = require("express");
const UsersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

module.exports = (usersService) => {
  const usersController = new UsersController(usersService);

  router.get(
    "/",
    authMiddleware,
    usersController.getUsersList.bind(usersController)
  );

  return router;
};
