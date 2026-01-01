import { db } from '../database';

export const processEventJob = async (job: any) => {
    const { eventId, type, payload } = job.data;
    const startTime = Date.now();

    console.log(`[Worker] Starting job ${job.id} for event ${eventId} (${type})`);

    try {
        // 1. Update status to PROCESSING (Optional, if we want detailed tracking)
        // await db.query("UPDATE events SET status = 'PROCESSING' WHERE id = $1", [eventId]);

        // 2. Simulate complex processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Example logic based on type
        if (type === 'FAIL_TEST') {
            throw new Error('Simulated failure');
        }

        // 3. Update DB to COMPLETED
        await db.query(
            "UPDATE events SET status = 'COMPLETED', result = $1, processed_at = NOW() WHERE id = $2",
            [{ processed: true, time: Date.now() - startTime }, eventId]
        );

        console.log(`[Worker] Job ${job.id} completed.`);
        return { success: true };

    } catch (err: any) {
        console.error(`[Worker] Job ${job.id} failed:`, err.message);

        // If we want to mark as FAILED in DB only after all retries are exhausted, 
        // we should handle that in the 'failed' event listener in the worker, not here.
        // Throwing error here triggers BullMQ retry.
        throw err;
    }
};
