import app from './app';
import { config } from './config';
import { db } from './database';

const startServer = async () => {
    try {
        // Test DB connection
        const client = await db.getClient();
        client.release();
        console.log('✅ Database connected');

        app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
    }
};

startServer();
