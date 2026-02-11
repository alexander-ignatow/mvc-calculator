import { HistoryRepository, HistoryItem } from '../domain';

export interface GetHistoryResult {
  items: HistoryItem[];
  take: number;
  skip: number;
}

/**
 * Use-case: retrieve a page of calculation history.
 */
export class GetHistoryUseCase {
  constructor(private readonly historyRepo: HistoryRepository) {}

  async execute(take: number, skip: number): Promise<GetHistoryResult> {
    const items = await this.historyRepo.findAll(take, skip);
    return { items, take, skip };
  }
}
