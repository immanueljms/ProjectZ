import Redis from 'ioredis';

export const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function connectRedis(): Promise<void> {
  await redisClient.ping();
}

