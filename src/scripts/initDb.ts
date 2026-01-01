import { db } from '../database';
import fs from 'fs';
import path from 'path';

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running database migrations...');
        await db.query(schemaSql);
        console.log('Database initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
