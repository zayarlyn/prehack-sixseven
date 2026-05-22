export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFound(resource: string): AppError {
  return new AppError(`${resource} not found`, 404);
}

export function forbidden(): AppError {
  return new AppError('Forbidden', 403);
}

export function badRequest(msg: string): AppError {
  return new AppError(msg, 400);
}

export function conflict(msg: string): AppError {
  return new AppError(msg, 409);
}
