import { HistoryItem } from '../domain/history.entity';
import { HistoryRepository } from '../domain/history.repository';

/* ------------------------------------------------------------------ *
 *  Mongo skeleton – extension point.
 *
 *  To activate this implementation:
 *    1. Install the MongoDB driver:  npm i mongodb
 *    2. Complete the TODOs below.
 *    3. Swap the repository in `src/main.ts`:
 *
 *       import { MongoHistoryRepository } from
 *         './modules/history/infra/mongo-history.repository';
 *
 *       const repo = new MongoHistoryRepository(mongoCollection);
 *       const app  = createApp(repo);
 *
 *  See README.md § "Swapping the repository" for more details.
 * ------------------------------------------------------------------ */

/**
 * MongoDB-backed implementation of {@link HistoryRepository}.
 *
 * ⚠️  This is a **skeleton** – it compiles but is not functional until
 * you provide a real MongoDB collection instance.
 */
export class MongoHistoryRepository implements HistoryRepository {
  // TODO: Replace `any` with the typed MongoDB Collection<HistoryDocument>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly collection: any) {}

  async save(item: HistoryItem): Promise<void> {
    // TODO: map HistoryItem → Mongo document and insertOne
    await this.collection.insertOne({
      _id: item.id,
      expression: item.expression,
      computation: item.computation,
      result: item.result,
      createdAt: item.createdAt,
    });
  }

  async findAll(take: number, skip: number): Promise<HistoryItem[]> {
    // TODO: add sorting / projection as needed
    const docs = await this.collection.find().skip(skip).limit(take).toArray();

    return docs.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc: any): HistoryItem => ({
        id: doc._id,
        expression: doc.expression,
        computation: doc.computation,
        result: doc.result,
        createdAt: new Date(doc.createdAt),
      }),
    );
  }
}
