import { Token, TokenType } from './tokenizer';
import { ASTNode } from './types';
import { InvalidExpressionError } from './errors';

/* ------------------------------------------------------------------ *
 *  Recursive-descent parser.
 *
 *  Grammar:
 *    Expression := Term (('+' | '-') Term)*
 *    Term       := Factor (('*' | '/') Factor)*
 *    Factor     := '-' Factor | '(' Expression ')' | Number
 * ------------------------------------------------------------------ */

/**
 * Parses an array of tokens into an AST.
 *
 * @throws InvalidExpressionError on malformed input.
 */
export function parse(tokens: Token[]): ASTNode {
  let pos = 0;

  function peek(): Token {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function expect(type: TokenType): Token {
    const token = peek();
    if (token.type !== type) {
      throw new InvalidExpressionError(
        `expected ${type} but got ${token.type} at position ${token.position}`,
      );
    }
    return consume();
  }

  /* Expression := Term (('+' | '-') Term)* */
  function parseExpression(): ASTNode {
    let left = parseTerm();

    while (peek().type === TokenType.Plus || peek().type === TokenType.Minus) {
      const op = consume();
      const right = parseTerm();
      left = {
        type: 'binary',
        operator: op.value as '+' | '-',
        left,
        right,
      };
    }

    return left;
  }

  /* Term := Factor (('*' | '/') Factor)* */
  function parseTerm(): ASTNode {
    let left = parseFactor();

    while (peek().type === TokenType.Multiply || peek().type === TokenType.Divide) {
      const op = consume();
      const right = parseFactor();
      left = {
        type: 'binary',
        operator: op.value as '*' | '/',
        left,
        right,
      };
    }

    return left;
  }

  /* Factor := '-' Factor | '(' Expression ')' | Number */
  function parseFactor(): ASTNode {
    const token = peek();

    // Unary minus
    if (token.type === TokenType.Minus) {
      consume();
      const operand = parseFactor();
      return { type: 'unary', operator: '-', operand };
    }

    // Parenthesised sub-expression
    if (token.type === TokenType.LeftParen) {
      consume();
      const expr = parseExpression();
      expect(TokenType.RightParen);
      return expr;
    }

    // Number literal
    if (token.type === TokenType.Number) {
      consume();
      return { type: 'number', value: parseFloat(token.value) };
    }

    throw new InvalidExpressionError(
      `unexpected token '${token.value}' at position ${token.position}`,
    );
  }

  // ── entry point ──────────────────────────────────────────────
  const ast = parseExpression();

  if (peek().type !== TokenType.EOF) {
    throw new InvalidExpressionError(
      `unexpected token '${peek().value}' at position ${peek().position}`,
    );
  }

  return ast;
}
