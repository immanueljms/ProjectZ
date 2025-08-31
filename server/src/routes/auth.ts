import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pg } from '../services/db';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
  const { email, password } = parse.data;

  const existing = await pg.query('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.rows.length > 0) return res.status(409).json({ error: 'Email exists' });

  const hash = await bcrypt.hash(password, 10);
  const result = await pg.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, hash]
  );
  const user = result.rows[0];
  res.json({ user });
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
  const { email, password } = parse.data;

  const result = await pg.query('SELECT id, email, password_hash FROM users WHERE email=$1', [email]);
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  res.json({ token });
});

// OAuth stubs
router.get('/google', (_req, res) => {
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
});

router.get('/discord', (_req, res) => {
  res.status(501).json({ message: 'Discord OAuth not implemented yet' });
});

router.get('/oauth/callback', (_req, res) => {
  res.status(501).json({ message: 'OAuth callback not implemented yet' });
});

export default router;

