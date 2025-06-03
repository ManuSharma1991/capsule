import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  userId: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Attach user info to request object for later use in handlers
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
