import { Router } from 'express';
import { HistoryController } from './history.controller';
import { HistoryRepository } from '../domain';

/**
 * Mounts history-related routes.
 *
 * @param historyRepo – injected repository (DI at composition root)
 */
export function historyRoutes(historyRepo: HistoryRepository): Router {
  const router = Router();
  const controller = new HistoryController(historyRepo);

  router.get('/', controller.getHistory);

  return router;
}
