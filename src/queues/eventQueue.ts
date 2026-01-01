import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const eventQueueName = 'event-processing-queue';

export const eventQueue = new Queue(eventQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for inspection
    },
});
