import { Pool } from 'pg';

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function connectPostgres(): Promise<void> {
  await pgPool.connect();
  await ensureSchema();
}

async function ensureSchema() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);
}

