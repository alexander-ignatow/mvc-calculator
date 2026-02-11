import crypto from 'node:crypto';
import { tokenize, parse, evaluate } from '../domain';
import { HistoryRepository, HistoryItem } from '../../history/domain';

/**
 * Use-case: parse, evaluate an expression and persist the result.
 */
export class CalculateAndStoreUseCase {
  constructor(private readonly historyRepo: HistoryRepository) {}

  async execute(expression: string): Promise<HistoryItem> {
    const tokens = tokenize(expression);
    const ast = parse(tokens);
    const result = evaluate(ast);

    const item: HistoryItem = {
      id: crypto.randomUUID(),
      expression,
      computation: ast,
      result,
      createdAt: new Date(),
    };

    await this.historyRepo.save(item);
    return item;
  }
}
