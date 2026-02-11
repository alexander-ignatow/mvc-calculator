/* ------------------------------------------------------------------ *
 *  AST node types for arithmetic expressions.
 *
 *  Grammar (recursive-descent):
 *    Expression := Term (('+' | '-') Term)*
 *    Term       := Factor (('*' | '/') Factor)*
 *    Factor     := '-' Factor | '(' Expression ')' | Number
 *    Number     := [0-9]+ ('.' [0-9]+)?
 * ------------------------------------------------------------------ */

/** Numeric literal – leaf node */
export interface NumberLiteral {
  type: 'number';
  value: number;
}

/** Binary operation – two operands */
export interface BinaryExpression {
  type: 'binary';
  operator: '+' | '-' | '*' | '/';
  left: ASTNode;
  right: ASTNode;
}

/** Unary operation – single operand (negation) */
export interface UnaryExpression {
  type: 'unary';
  operator: '-';
  operand: ASTNode;
}

/** Discriminated union of all AST node kinds */
export type ASTNode = NumberLiteral | BinaryExpression | UnaryExpression;
