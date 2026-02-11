import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';

/**
 * Central error-handling middleware.
 *
 * Maps known error types to the appropriate HTTP status code
 * and returns a consistent JSON envelope.
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  /* ── Zod validation errors → 400 ─────────────────────────── */
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  /* ── Domain / App errors → statusCode from the error ────── */
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  /* ── Catch-all → 500 ────────────────────────────────────── */
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
