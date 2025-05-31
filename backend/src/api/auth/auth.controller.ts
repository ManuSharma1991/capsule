import { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema } from './auth.validation';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ error: validation.error });

    await authService.registerUser(validation.data);
    return res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ error: validation.error });

    const result = await authService.loginUser(validation.data);
    return res.status(200).json(result);
};