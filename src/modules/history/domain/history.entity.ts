/**
 * A single calculation history record.
 *
 * `computation` is intentionally typed as `unknown` so that the history
 * module stays decoupled from the calculator module's AST types.
 */
export interface HistoryItem {
  /** Unique identifier (UUID v4). */
  id: string;
  /** The original expression string sent by the client. */
  expression: string;
  /** Structured representation of the computation (AST). */
  computation: unknown;
  /** Evaluated numeric result. */
  result: number;
  /** Timestamp of creation. */
  createdAt: Date;
}
