import { Request, Response, NextFunction } from 'express';
import { calculateDtoSchema } from './calculator.dto';
import { CalculateAndStoreUseCase } from '../app';
import { HistoryRepository } from '../../history/domain';

/**
 * HTTP controller for calculator operations.
 *
 * Thin layer: validates input, delegates to the use-case, returns JSON.
 */
export class CalculatorController {
  private readonly useCase: CalculateAndStoreUseCase;

  constructor(historyRepo: HistoryRepository) {
    this.useCase = new CalculateAndStoreUseCase(historyRepo);
  }

  /** POST /calculator */
  calculate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = calculateDtoSchema.parse(req.body);
      const item = await this.useCase.execute(dto.expression);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };
}
