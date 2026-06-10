import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> };

export const redis = globalForRedis.redis || createClient({
  url: redisUrl,
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

if (!redis.isOpen) {
  redis.connect().catch(console.error);
}
