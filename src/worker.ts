import { Worker, Job } from 'bullmq';
import { redisConnection } from './config/redis';
import { eventQueueName } from './queues/eventQueue';
import { processEventJob } from './services/eventProcessor';
import { db } from './database';

console.log('Starting EventFlow Worker Service...');

const worker = new Worker(
    eventQueueName,
    async (job: Job) => {
        await processEventJob(job);
    },
    {
        connection: redisConnection,
        concurrency: 5, // Process 5 jobs in parallel
        limiter: {
            max: 10,
            duration: 1000 // Rate limit: max 10 jobs per second per worker
        }
    }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on('failed', async (job, err) => {
    console.error(`Job ${job?.id} failed with ${err.message}`);
    // If job has exhausted attempts
    if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        console.log(`Job ${job.id} exhausted retries. Marking as FAILED in DB.`);
        try {
            // This is the Dead Letter handling logic (persisting failure)
            await db.query(
                "UPDATE events SET status = 'FAILED', result = $1 WHERE id = $2",
                [{ error: err.message }, job.data.eventId]
            );
        } catch (dbErr) {
            console.error('Failed to update event status to FAILED', dbErr);
        }
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Closing worker...');
    await worker.close();
    process.exit(0);
});
