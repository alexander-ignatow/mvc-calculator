import { AppError } from '../../../shared/errors';

/** Thrown when the input expression cannot be parsed. */
export class InvalidExpressionError extends AppError {
  constructor(detail: string) {
    super(`Invalid expression: ${detail}`, 400);
  }
}

/** Thrown when evaluation encounters a division by zero. */
export class DivisionByZeroError extends AppError {
  constructor() {
    super('Division by zero', 422);
  }
}
