module.exports = class ErrorApi extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static BadRequestError(message) {
    return new ErrorApi(400, message);
  }

  static UnauthorizedError(message) {
    return new ErrorApi(401, message);
  }

  static ForbiddenError(message) {
    return new ErrorApi(403, message);
  }

  static NotFoundError(message) {
    return new ErrorApi(404, message);
  }

  static ConflictError(message) {
    return new ErrorApi(409, message);
  }
};
