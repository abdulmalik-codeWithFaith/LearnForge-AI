import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined;
};

export const redisConnection =
  globalForRedis.redis ??
  new IORedis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null,
    tls: {}, // explicitly enable TLS for rediss:// connections (Upstash requires this)
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redisConnection;
}