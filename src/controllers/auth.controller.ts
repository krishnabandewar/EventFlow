import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new Error('Email and password required')); // Simple validation
        }
        const user = await AuthService.register(email, password);
        res.status(201).json({ status: 'success', data: { user } });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await AuthService.login(email, password);
        res.status(200).json({ status: 'success', token, data: { user } });
    } catch (err) {
        next(err);
    }
};
