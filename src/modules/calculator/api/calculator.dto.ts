import { z } from 'zod';

/** Request body schema for POST /calculator */
export const calculateDtoSchema = z.object({
  expression: z.string().min(1, 'expression must be a non-empty string'),
});

export type CalculateDto = z.infer<typeof calculateDtoSchema>;
