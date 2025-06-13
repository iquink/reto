const express = require("express");
const UsersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const errorHandler = require("../middleware/errorHandler");
const router = express.Router();

module.exports = (usersService) => {
  const usersController = new UsersController(usersService);

//   router.post(
//     "/",
//     authMiddleware,
//     usersController.createUser.bind(usersController)
//   );
  router.get(
    "/",
    authMiddleware,
    usersController.getUsersList.bind(usersController)
  );
//   router.get(
//     "/:id",
//     authMiddleware,
//     usersController.getUserById.bind(usersController)
//   );
//   router.put(
//     "/:id",
//     authMiddleware,
//     usersController.updateUser.bind(usersController)
//   );
//   router.put(
//     "/delete/:id",
//     authMiddleware,
//     usersController.blockUser.bind(usersController)
//   );

  return router;
};
