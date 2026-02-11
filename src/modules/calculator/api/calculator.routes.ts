import { Router } from 'express';
import { CalculatorController } from './calculator.controller';
import { HistoryRepository } from '../../history/domain';

/**
 * Mounts calculator-related routes.
 *
 * @param historyRepo – injected repository (DI at composition root)
 */
export function calculatorRoutes(historyRepo: HistoryRepository): Router {
  const router = Router();
  const controller = new CalculatorController(historyRepo);

  router.post('/', controller.calculate);

  return router;
}
