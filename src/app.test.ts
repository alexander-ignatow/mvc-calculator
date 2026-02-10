import request from 'supertest';
import app from './app';

describe('GET /health', () => {
  it('should return "Service is up and running"', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Service is up and running');
  });
});
