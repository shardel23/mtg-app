import Redis from "ioredis";

const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_URL!, {
    password: process.env.REDIS_PASSWORD,
  });
};

type RedisClientSingleton = ReturnType<typeof redisClientSingleton>;

const globalForRedis = globalThis as unknown as {
  redis: RedisClientSingleton | undefined;
};

export const redis = globalForRedis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
