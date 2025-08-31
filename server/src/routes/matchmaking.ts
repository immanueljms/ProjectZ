import { Router } from 'express';
import { redis } from '../services/cache';
import { requireAuth } from '../services/jwt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/find', requireAuth, async (req, res) => {
  const userId = req.userId!;
  const ticketId = uuidv4();
  await redis.set(`matchmaking:${ticketId}`, JSON.stringify({ userId, status: 'searching' }), 'EX', 60);
  res.json({ ticketId });
});

router.post('/cancel', requireAuth, async (req, res) => {
  const { ticketId } = req.body as { ticketId?: string };
  if (!ticketId) return res.status(400).json({ error: 'ticketId required' });
  await redis.del(`matchmaking:${ticketId}`);
  res.json({ ok: true });
});

router.get('/status/:ticketId', requireAuth, async (req, res) => {
  const key = `matchmaking:${req.params.ticketId}`;
  const data = await redis.get(key);
  if (!data) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(data));
});

export default router;

