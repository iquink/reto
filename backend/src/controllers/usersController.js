class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async getUsersList(req, res, next) {
    try {
      const { userId } = req;
      const usersList = await this.usersService.getUsersList(userId);
      res.status(200).json(usersList);
    } catch (error) {
        next(error);
    }
  }
}

module.exports = UsersController;