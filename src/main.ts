import { createApp } from './app';
import { InMemoryHistoryRepository } from './modules/history/infra';

/* ── Composition root ───────────────────────────────────────────── *
 *  Wire concrete dependencies and start the server.
 *
 *  To swap the repository implementation, replace
 *  `InMemoryHistoryRepository` with e.g. `MongoHistoryRepository`.
 * ---------------------------------------------------------------- */

const PORT = Number(process.env.PORT) || 3000;

const historyRepo = new InMemoryHistoryRepository();
const app = createApp(historyRepo);

app.listen(PORT, () => {
  console.log(`🚀 Calculator API running → http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/health`);
});
