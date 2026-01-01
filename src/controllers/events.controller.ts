import { Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { AuthRequest } from '../middlewares/protect';
import { AppError } from '../utils/AppError';

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { type, payload } = req.body;
        if (!type || !payload) {
            return next(new AppError('Event type and payload are required', 400));
        }

        const event = await EventService.createEvent(req.user.id, type, payload);

        // 202 Accepted because processing is async
        res.status(202).json({
            status: 'success',
            data: { event },
            message: 'Event accepted for processing'
        });
    } catch (err) {
        next(err);
    }
};

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const events = await EventService.getEvents(req.user.id);
        res.status(200).json({ status: 'success', results: events.length, data: { events } });
    } catch (err) {
        next(err);
    }
};

export const getEventById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const event = await EventService.getEventById(req.user.id, req.params.id);
        if (!event) return next(new AppError('Event not found', 404));

        res.status(200).json({ status: 'success', data: { event } });
    } catch (err) {
        next(err);
    }
};
