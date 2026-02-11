import { InvalidExpressionError } from './errors';

/* ------------------------------------------------------------------ *
 *  Token types & tokenizer for arithmetic expressions.
 * ------------------------------------------------------------------ */

export enum TokenType {
  Number = 'NUMBER',
  Plus = 'PLUS',
  Minus = 'MINUS',
  Multiply = 'MULTIPLY',
  Divide = 'DIVIDE',
  LeftParen = 'LPAREN',
  RightParen = 'RPAREN',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

/**
 * Converts a raw arithmetic expression string into an array of tokens.
 *
 * Supported tokens: numbers (integers & decimals), +, -, *, /, (, )
 * Whitespace is ignored.
 *
 * @throws InvalidExpressionError on unexpected characters.
 */
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number literal (integer or decimal)
    if (/[0-9.]/.test(ch)) {
      const start = i;
      let hasDot = false;
      let num = '';

      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        if (expression[i] === '.') {
          if (hasDot) {
            throw new InvalidExpressionError(`unexpected '.' at position ${i}`);
          }
          hasDot = true;
        }
        num += expression[i];
        i++;
      }

      // Reject standalone dot
      if (num === '.') {
        throw new InvalidExpressionError(`unexpected '.' at position ${start}`);
      }

      tokens.push({ type: TokenType.Number, value: num, position: start });
      continue;
    }

    // Single-character operators & parentheses
    const CHAR_MAP: Record<string, TokenType> = {
      '+': TokenType.Plus,
      '-': TokenType.Minus,
      '*': TokenType.Multiply,
      '/': TokenType.Divide,
      '(': TokenType.LeftParen,
      ')': TokenType.RightParen,
    };

    const tokenType = CHAR_MAP[ch];
    if (tokenType) {
      tokens.push({ type: tokenType, value: ch, position: i });
      i++;
      continue;
    }

    throw new InvalidExpressionError(`unexpected character '${ch}' at position ${i}`);
  }

  tokens.push({ type: TokenType.EOF, value: '', position: i });
  return tokens;
}
