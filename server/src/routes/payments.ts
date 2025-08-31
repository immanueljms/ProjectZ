import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../services/jwt';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test', { apiVersion: '2024-04-10' as any });

router.post('/create-checkout-session', requireAuth, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'P2PC Credits' },
          unit_amount: 500
        },
        quantity: 1
      }
    ],
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel'
  });
  res.json({ id: session.id, url: session.url });
});

router.post('/webhook', (req, res) => {
  // In production, verify signature using STRIPE_WEBHOOK_SECRET
  res.json({ received: true });
});

export default router;

