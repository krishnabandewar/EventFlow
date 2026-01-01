import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/eventflow',
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    jwtSecret: process.env.JWT_SECRET || 'secret',
    env: process.env.NODE_ENV || 'development',
};
