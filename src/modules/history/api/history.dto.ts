import { z } from 'zod';

/** Query-string schema for GET /calculator */
export const historyQuerySchema = z.object({
  take: z.coerce.number().int().min(1).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});

export type HistoryQuery = z.infer<typeof historyQuerySchema>;
