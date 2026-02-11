/**
 * Base application error with an associated HTTP status code.
 * All domain / app errors should extend this class so the central
 * error-handler middleware can map them to the correct response.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
