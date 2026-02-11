import { describe, it, expect } from 'vitest';
import {
  tokenize,
  TokenType,
  parse,
  evaluate,
  InvalidExpressionError,
  DivisionByZeroError,
} from '../src/modules/calculator/domain';
import type { ASTNode } from '../src/modules/calculator/domain';

/* ================================================================== *
 *  Tokenizer
 * ================================================================== */
describe('tokenizer', () => {
  it('should tokenize a simple addition', () => {
    const tokens = tokenize('3 + 4');
    expect(tokens).toEqual([
      { type: TokenType.Number, value: '3', position: 0 },
      { type: TokenType.Plus, value: '+', position: 2 },
      { type: TokenType.Number, value: '4', position: 4 },
      { type: TokenType.EOF, value: '', position: 5 },
    ]);
  });

  it('should tokenize decimals', () => {
    const tokens = tokenize('3.14');
    expect(tokens[0]).toEqual({
      type: TokenType.Number,
      value: '3.14',
      position: 0,
    });
  });

  it('should tokenize negative sign as minus token', () => {
    const tokens = tokenize('-5');
    expect(tokens[0].type).toBe(TokenType.Minus);
    expect(tokens[1].type).toBe(TokenType.Number);
  });

  it('should tokenize parentheses', () => {
    const tokens = tokenize('(1+2)');
    expect(tokens.map((t) => t.type)).toEqual([
      TokenType.LeftParen,
      TokenType.Number,
      TokenType.Plus,
      TokenType.Number,
      TokenType.RightParen,
      TokenType.EOF,
    ]);
  });

  it('should tokenize all operators', () => {
    const tokens = tokenize('1+2-3*4/5');
    const ops = tokens
      .filter(
        (t) =>
          t.type !== TokenType.Number && t.type !== TokenType.EOF,
      )
      .map((t) => t.value);
    expect(ops).toEqual(['+', '-', '*', '/']);
  });

  it('should skip whitespace', () => {
    const tokens = tokenize('  1   +   2  ');
    expect(tokens).toHaveLength(4); // 1, +, 2, EOF
  });

  it('should throw on unexpected character', () => {
    expect(() => tokenize('3 & 4')).toThrow(InvalidExpressionError);
  });

  it('should throw on double dot in number', () => {
    expect(() => tokenize('3.1.4')).toThrow(InvalidExpressionError);
  });

  it('should throw on standalone dot', () => {
    expect(() => tokenize('.')).toThrow(InvalidExpressionError);
  });
});

/* ================================================================== *
 *  Parser
 * ================================================================== */
describe('parser', () => {
  const parseExpr = (input: string): ASTNode => parse(tokenize(input));

  it('should parse a single number', () => {
    expect(parseExpr('42')).toEqual({ type: 'number', value: 42 });
  });

  it('should parse addition', () => {
    expect(parseExpr('1+2')).toEqual({
      type: 'binary',
      operator: '+',
      left: { type: 'number', value: 1 },
      right: { type: 'number', value: 2 },
    });
  });

  it('should respect operator precedence (* before +)', () => {
    // 2 + 3 * 4  →  2 + (3*4)
    const ast = parseExpr('2 + 3 * 4');
    expect(ast).toEqual({
      type: 'binary',
      operator: '+',
      left: { type: 'number', value: 2 },
      right: {
        type: 'binary',
        operator: '*',
        left: { type: 'number', value: 3 },
        right: { type: 'number', value: 4 },
      },
    });
  });

  it('should handle parentheses overriding precedence', () => {
    // (2 + 3) * 4
    const ast = parseExpr('(2 + 3) * 4');
    expect(ast).toEqual({
      type: 'binary',
      operator: '*',
      left: {
        type: 'binary',
        operator: '+',
        left: { type: 'number', value: 2 },
        right: { type: 'number', value: 3 },
      },
      right: { type: 'number', value: 4 },
    });
  });

  it('should handle nested parentheses', () => {
    const ast = parseExpr('((1))');
    expect(ast).toEqual({ type: 'number', value: 1 });
  });

  it('should parse unary minus', () => {
    const ast = parseExpr('-3');
    expect(ast).toEqual({
      type: 'unary',
      operator: '-',
      operand: { type: 'number', value: 3 },
    });
  });

  it('should parse double unary minus', () => {
    const ast = parseExpr('--3');
    expect(ast).toEqual({
      type: 'unary',
      operator: '-',
      operand: {
        type: 'unary',
        operator: '-',
        operand: { type: 'number', value: 3 },
      },
    });
  });

  it('should throw on empty expression', () => {
    expect(() => parseExpr('')).toThrow(InvalidExpressionError);
  });

  it('should throw on incomplete expression', () => {
    expect(() => parseExpr('3 +')).toThrow(InvalidExpressionError);
  });

  it('should throw on trailing tokens', () => {
    expect(() => parseExpr('3 4')).toThrow(InvalidExpressionError);
  });

  it('should throw on unmatched parenthesis', () => {
    expect(() => parseExpr('(1 + 2')).toThrow(InvalidExpressionError);
  });
});

/* ================================================================== *
 *  Evaluator
 * ================================================================== */
describe('evaluator', () => {
  const calc = (input: string): number => evaluate(parse(tokenize(input)));

  it('should evaluate a single number', () => {
    expect(calc('42')).toBe(42);
  });

  it('should evaluate addition', () => {
    expect(calc('1 + 2')).toBe(3);
  });

  it('should evaluate subtraction', () => {
    expect(calc('10 - 3')).toBe(7);
  });

  it('should evaluate multiplication', () => {
    expect(calc('4 * 5')).toBe(20);
  });

  it('should evaluate division', () => {
    expect(calc('20 / 4')).toBe(5);
  });

  it('should respect operator precedence', () => {
    expect(calc('2 + 3 * 4')).toBe(14);
  });

  it('should respect parentheses', () => {
    expect(calc('(2 + 3) * 4')).toBe(20);
  });

  it('should handle unary minus', () => {
    expect(calc('-5')).toBe(-5);
  });

  it('should handle complex expression', () => {
    expect(calc('(10 + 2) * 3 - 4 / 2')).toBe(34);
  });

  it('should handle decimal numbers', () => {
    expect(calc('0.1 + 0.2')).toBeCloseTo(0.3);
  });

  it('should handle double negation', () => {
    expect(calc('--5')).toBe(5);
  });

  it('should throw DivisionByZeroError when dividing by zero', () => {
    expect(() => calc('1 / 0')).toThrow(DivisionByZeroError);
  });

  it('should throw DivisionByZeroError for complex zero divisor', () => {
    expect(() => calc('10 / (5 - 5)')).toThrow(DivisionByZeroError);
  });
});
