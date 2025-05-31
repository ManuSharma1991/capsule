// middleware/errorHandler.ts
import logger from '../utils/logger';
import { NextFunction, Request, Response } from 'express';

interface SqliteError extends Error {
    code?: string;
    errno?: number;
    message: string;
}

export function errorHandler(
    err: SqliteError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Handle SQLite unique constraint violation
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
            error: 'Conflict: Duplicate entry violates unique constraint.',
            details: err.message,
        });
    }

    // Handle primary key constraint violation
    if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        return res.status(409).json({
            error: 'Conflict: Primary key constraint violated.',
            details: err.message,
        });
    }

    // Handle foreign key constraint violation
    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return res.status(409).json({
            error: 'Conflict: Foreign key constraint violated.',
            details: err.message,
        });
    }

    // Handle database locked error (e.g., concurrent writes)
    if (err.code === 'SQLITE_BUSY') {
        return res.status(503).json({
            error: 'Service Unavailable: Database is busy. Please try again later.',
            details: err.message,
        });
    }

    // Default fallback for other errors
    return res.status(500).json({
        error: 'Internal Server Error',
        details: err.message,
    });
}
