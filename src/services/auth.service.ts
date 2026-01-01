import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database';
import { config } from '../config';
import { AppError } from '../utils/AppError';

export class AuthService {
    static async register(email: string, password: string) {
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new AppError('User already exists', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const result = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role, created_at',
            [email, hash]
        );

        return result.rows[0];
    }

    static async login(email: string, password: string) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
            expiresIn: '1d',
        });

        return { token, user: { id: user.id, email: user.email, role: user.role } };
    }
}
