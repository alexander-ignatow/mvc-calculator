import { ASTNode } from './types';
import { DivisionByZeroError } from './errors';

/**
 * Recursively evaluates an AST node to a numeric result.
 *
 * @throws DivisionByZeroError when dividing by zero.
 */
export function evaluate(node: ASTNode): number {
  switch (node.type) {
    case 'number':
      return node.value;

    case 'unary':
      return -evaluate(node.operand);

    case 'binary': {
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) {
            throw new DivisionByZeroError();
          }
          return left / right;
      }
    }
  }
}
