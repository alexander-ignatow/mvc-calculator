import { HistoryItem } from './history.entity';

/**
 * Abstract repository contract for history persistence.
 *
 * Implementations can be swapped at the composition root (see `src/main.ts`).
 * Currently provided:
 *   • InMemoryHistoryRepository  – used by default (no external deps)
 *   • MongoHistoryRepository     – skeleton / extension point
 */
export interface HistoryRepository {
  /** Persist a new history record. */
  save(item: HistoryItem): Promise<void>;

  /**
   * Return a page of history items in insertion order.
   *
   * @param take – max number of items to return
   * @param skip – number of items to skip from the start
   */
  findAll(take: number, skip: number): Promise<HistoryItem[]>;
}
