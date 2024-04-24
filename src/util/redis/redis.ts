import Redis from "ioredis";

const redisClientSingleton = () => {
  return process.env.NODE_ENV === "development"
    ? new Redis(process.env.REDIS_URL || "", {
        password: process.env.REDIS_PASSWORD || "",
      })
    : new Redis(
        `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`,
      );
};

type RedisClientSingleton = ReturnType<typeof redisClientSingleton>;

const globalForRedis = globalThis as unknown as {
  redis: RedisClientSingleton | undefined;
};

export const redis = globalForRedis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
