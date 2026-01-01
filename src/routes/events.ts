import express from 'express';
import { protect } from '../middlewares/protect';
import { createEvent, getEvents, getEventById } from '../controllers/events.controller';

const router = express.Router();

router.use(protect);

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);

export default router;
