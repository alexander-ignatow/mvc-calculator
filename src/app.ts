import express, { Request, Response } from 'express';
import { calculatorRoutes } from './modules/calculator/api';
import { historyRoutes } from './modules/history/api';
import { HistoryRepository } from './modules/history/domain';
import { errorHandler } from './shared/middleware';

/**
 * Creates and configures the Express application.
 *
 * Accepts a {@link HistoryRepository} so the composition root (main.ts)
 * can decide which implementation to wire in (in-memory, Mongo, etc.).
 */
export function createApp(historyRepo: HistoryRepository): express.Express {
  const app = express();

  /* ── Global middleware ─────────────────────────────────────── */
  app.use(express.json());

  /* ── Health check ──────────────────────────────────────────── */
  app.get('/health', (_req: Request, res: Response) => {
    res.send('Service is up and running');
  });

  /* ── Feature routes ────────────────────────────────────────── */
  app.use('/calculator', calculatorRoutes(historyRepo));
  app.use('/calculator', historyRoutes(historyRepo));

  /* ── Central error handler (must be registered last) ───────── */
  app.use(errorHandler);

  return app;
}
