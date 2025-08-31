import { Express, Request, Response } from 'express';
import authRouter from './auth';
import matchmakingRouter from './matchmaking';
import paymentsRouter from './payments';

export function registerRoutes(app: Express) {
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/matchmaking', matchmakingRouter);
  app.use('/api/payments', paymentsRouter);
}

