import { Request, Response, NextFunction } from 'express';
import { historyQuerySchema } from './history.dto';
import { GetHistoryUseCase } from '../app';
import { HistoryRepository } from '../domain';

/**
 * HTTP controller for history operations.
 */
export class HistoryController {
  private readonly useCase: GetHistoryUseCase;

  constructor(historyRepo: HistoryRepository) {
    this.useCase = new GetHistoryUseCase(historyRepo);
  }

  /** GET /calculator?take=N&skip=M */
  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = historyQuerySchema.parse(req.query);
      const result = await this.useCase.execute(query.take, query.skip);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
