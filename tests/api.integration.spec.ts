import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { InMemoryHistoryRepository } from '../src/modules/history/infra';

describe('Calculator API – integration tests', () => {
  let app: ReturnType<typeof createApp>;
  let repo: InMemoryHistoryRepository;

  beforeEach(() => {
    repo = new InMemoryHistoryRepository();
    app = createApp(repo);
  });

  /* ────────────────────────────────────────────────────────────── *
   *  Health check
   * ────────────────────────────────────────────────────────────── */
  describe('GET /health', () => {
    it('should return 200 with status text', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Service is up and running');
    });
  });

  /* ────────────────────────────────────────────────────────────── *
   *  POST /calculator
   * ────────────────────────────────────────────────────────────── */
  describe('POST /calculator', () => {
    it('should evaluate a simple addition and return 200', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '2 + 3' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        expression: '2 + 3',
        result: 5,
      });
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('computation');
      expect(res.body).toHaveProperty('createdAt');
    });

    it('should evaluate complex expression with precedence', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '(10 + 2) * 3 - 4 / 2' });

      expect(res.status).toBe(200);
      expect(res.body.result).toBe(34);
    });

    it('should return 400 for invalid syntax', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '2 +' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for empty expression', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when expression is missing', async () => {
      const res = await request(app).post('/calculator').send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 when expression is not a string', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: 123 });

      expect(res.status).toBe(400);
    });

    it('should return 422 for division by zero', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '1 / 0' });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/division by zero/i);
    });

    it('should persist the history item', async () => {
      await request(app)
        .post('/calculator')
        .send({ expression: '1 + 1' });

      const items = await repo.findAll(10, 0);
      expect(items).toHaveLength(1);
      expect(items[0].result).toBe(2);
    });

    it('should return the computation AST', async () => {
      const res = await request(app)
        .post('/calculator')
        .send({ expression: '3 * 4' });

      expect(res.body.computation).toEqual({
        type: 'binary',
        operator: '*',
        left: { type: 'number', value: 3 },
        right: { type: 'number', value: 4 },
      });
    });
  });

  /* ────────────────────────────────────────────────────────────── *
   *  GET /calculator (history)
   * ────────────────────────────────────────────────────────────── */
  describe('GET /calculator', () => {
    it('should return empty history initially', async () => {
      const res = await request(app).get('/calculator');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        items: [],
        take: 20,
        skip: 0,
      });
    });

    it('should return items after calculations', async () => {
      await request(app).post('/calculator').send({ expression: '1+1' });
      await request(app).post('/calculator').send({ expression: '2*3' });

      const res = await request(app).get('/calculator');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.items[0].result).toBe(2);
      expect(res.body.items[1].result).toBe(6);
    });

    it('should respect take parameter', async () => {
      await request(app).post('/calculator').send({ expression: '1+1' });
      await request(app).post('/calculator').send({ expression: '2+2' });
      await request(app).post('/calculator').send({ expression: '3+3' });

      const res = await request(app).get('/calculator?take=2');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.take).toBe(2);
    });

    it('should respect skip parameter', async () => {
      await request(app).post('/calculator').send({ expression: '1+1' });
      await request(app).post('/calculator').send({ expression: '2+2' });
      await request(app).post('/calculator').send({ expression: '3+3' });

      const res = await request(app).get('/calculator?skip=1');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.items[0].result).toBe(4);
      expect(res.body.skip).toBe(1);
    });

    it('should respect take and skip together', async () => {
      await request(app).post('/calculator').send({ expression: '1+1' });
      await request(app).post('/calculator').send({ expression: '2+2' });
      await request(app).post('/calculator').send({ expression: '3+3' });

      const res = await request(app).get('/calculator?take=1&skip=1');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].result).toBe(4);
      expect(res.body.take).toBe(1);
      expect(res.body.skip).toBe(1);
    });
  });
});
