import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
    connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    getClient: () => pool.connect(),
};
