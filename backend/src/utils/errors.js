class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Access denied.") {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found.") {
    super(message, 404);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized.") {
    super(message, 401);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad request.") {
    super(message, 400);
  }
}

module.exports = {
  CustomError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
};
