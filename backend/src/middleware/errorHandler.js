const { CustomError } = require("../utils/errors");

const errorHandler = (error, req, res, next) => {
  console.log("Error type:", error.constructor.name); // Логируем тип ошибки
  console.log("Error instanceof CustomError:", error instanceof CustomError); // Проверяем, является ли ошибка CustomError
  console.log("Error details:", error); // Логируем полную информацию об ошибке

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(500).json({ error: "Internal server error." });
};

module.exports = errorHandler;