import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
// Routes
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.send('EventFlow API is running 🚀');
});

// Health Check
app.get('/health', async (req, res) => {
    // Ideally check DB and Redis connectivity here
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);

// Error Handling
app.use(errorHandler);

export default app;
