import express, { Request, Response } from 'express';

const app = express();

// Middleware
app.use(express.json());

// Health endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.send('Service is up and running');
});

export default app;
