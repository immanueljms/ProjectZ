import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { json } from 'express';
import { createServer as createHttpServer } from 'http';
import { createWebSocketServer } from './realtime/wsServer';
import { registerRoutes } from './routes';
import { connectPostgres } from './lib/postgres';
import { connectRedis } from './lib/redis';

const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(json());

registerRoutes(app);

const server = createHttpServer(app);
createWebSocketServer(server);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  await connectPostgres();
  await connectRedis();
  server.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('[server] failed to start', err);
  process.exit(1);
});

