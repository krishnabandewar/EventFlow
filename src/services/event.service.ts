import { db } from '../database';
import { eventQueue } from '../queues/eventQueue';
import { AppError } from '../utils/AppError';

export class EventService {
    static async createEvent(userId: string, type: string, payload: any) {
        // 1. Persist 'PENDING' event to DB (Transactional Outbox Pattern-ish)
        // We save first to ensure we have a record.
        const result = await db.query(
            'INSERT INTO events (user_id, type, payload, status) VALUES ($1, $2, $3, $4) RETURNING id, status, created_at',
            [userId, type, payload, 'PENDING']
        );
        const event = result.rows[0];

        // 2. Publish to Redis Queue
        // We add the eventId to the queue. The worker will fetch details or we pass payload.
        // Passing payload is faster but less consistent if DB and Queue drift.
        // We'll pass minimal info: { eventId, type, payload }.
        await eventQueue.add('process-event', {
            eventId: event.id,
            userId,
            type,
            payload
        }, {
            jobId: event.id // Use DB ID as Job ID for easy tracking/deduplication in BullMQ
        });

        return event;
    }

    static async getEvents(userId: string, limit = 10, offset = 0) {
        const result = await db.query(
            'SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [userId, limit, offset]
        );
        return result.rows;
    }

    static async getEventById(userId: string, eventId: string) {
        const result = await db.query(
            'SELECT * FROM events WHERE id = $1 AND user_id = $2',
            [eventId, userId]
        );
        return result.rows[0];
    }
}
