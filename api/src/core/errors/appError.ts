class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for quick error creation
  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(message, 401);
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message: string) {
    return new AppError(message, 404);
  }

  static methodNotAllowed(message: string = "Method not allowed") {
    return new AppError(message, 405);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static alreadyExists(resource: string) {
    return new AppError(`${resource} already exists`, 409);
  }

  static invalidInput(field: string) {
    return new AppError(`Invalid ${field}`, 400);
  }

  static requiredFieldMissing(field: string) {
    return new AppError(`${field} is required`, 400);
  }

  static unprocessableEntity(message: string) {
    return new AppError(message, 422);
  }

  static tooManyRequests(message: string = "Too many requests, please try again later") {
    return new AppError(message, 429);
  }

  static serviceUnavailable(message: string = "Service temporarily unavailable") {
    return new AppError(message, 503);
  }

  static internalError(message: string = "Internal server error") {
    return new AppError(message, 500);
  }

  static accessDenied(message: string = "Access denied") {
    return new AppError(message, 403);
  }

  static validationError(message: string) {
    return new AppError(message, 422);
  }

  static notAuthorized(resource: string) {
    return new AppError(`You are not authorized to access ${resource}`, 403);
  }

  static recordNotFound(resource: string) {
    return new AppError(`${resource} not found`, 404);
  }
}

export default AppError;
