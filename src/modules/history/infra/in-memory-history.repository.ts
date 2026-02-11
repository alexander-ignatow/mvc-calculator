import { HistoryItem } from '../domain/history.entity';
import { HistoryRepository } from '../domain/history.repository';

/**
 * Simple in-memory implementation of {@link HistoryRepository}.
 *
 * Data lives only for the lifetime of the process – suitable for
 * development, testing, and demos.
 */
export class InMemoryHistoryRepository implements HistoryRepository {
  private readonly items: HistoryItem[] = [];

  async save(item: HistoryItem): Promise<void> {
    this.items.push(item);
  }

  async findAll(take: number, skip: number): Promise<HistoryItem[]> {
    return this.items.slice(skip, skip + take);
  }
}
