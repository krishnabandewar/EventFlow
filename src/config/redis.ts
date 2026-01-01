import IORedis from 'ioredis';
import { config } from './index';

// Metadata: Redis connection for Queue and Caching
export const redisConnection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null, // Required for BullMQ
});

export const redisClient = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
});
