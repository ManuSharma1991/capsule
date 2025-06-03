// middleware/errorHandler.ts
import logger from '../utils/logger'; // Assuming you have a logger utility
import { NextFunction, Request, Response } from 'express';
import { AppError } from './appError'; // Adjust path to your AppError and codes
import { AUTH_ERROR_CODES } from '../utils/constants';

// Define a more specific type for errors that might come from SQLite
interface ExtendedError extends Error {
  code?: string; // For SQLite error codes like SQLITE_CONSTRAINT_UNIQUE
  errno?: number; // Another common property for system errors
  statusCode?: number; // For AppError or other HTTP-aware errors
  errorCode?: string; // For AppError
  isOperational?: boolean; // For AppError
}

export function errorHandler(
  err: ExtendedError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction // next is required for Express to recognize it as an error handler
) {
  // Log the error. For operational errors, info might be fine. For unexpected, use error.
  if (err instanceof AppError && err.isOperational) {
    logger.info(`Operational Error: ${err.message}`, {
      errorCode: err.errorCode,
      statusCode: err.statusCode,
      path: req.path,
    });
  } else {
    // Log more details for unexpected errors or non-AppError system errors
    logger.error(`Unhandled Error: ${err.message}`, {
      error: err, // Log the full error object
      stack: err.stack,
      path: req.path,
    });
  }

  // 1. Handle instances of AppError (custom application errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  // 2. Handle specific SQLite errors and map them to your error structure
  // These will be caught if they weren't already wrapped in an AppError by the service layer
  switch (err.code) {
    case 'SQLITE_CONSTRAINT_UNIQUE':
      // Determine which unique constraint was violated if possible.
      // err.message might contain "UNIQUE constraint failed: users.email"
      // Based on that, you could set a more specific errorCode.
      let uniqueErrorCode = 'DB_UNIQUE_CONSTRAINT_VIOLATION';
      let uniqueMessage = 'A unique value constraint was violated.';
      if (err.message && err.message.toLowerCase().includes('users.empid')) {
        // Example check
        uniqueErrorCode = AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMP_ID;
        uniqueMessage = 'An employee with this ID already exists.';
      } else if (err.message && err.message.toLowerCase().includes('users.email')) {
        // Example check
        uniqueErrorCode = AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMAIL;
        uniqueMessage = 'An account with this email already exists.';
      }
      return res.status(409).json({
        // 409 Conflict
        success: false,
        errorCode: uniqueErrorCode,
        message: uniqueMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined, // Only show raw details in dev
      });

    case 'SQLITE_CONSTRAINT_PRIMARYKEY':
      return res.status(409).json({
        success: false,
        errorCode: 'DB_PRIMARY_KEY_VIOLATION',
        message: 'Primary key constraint violated.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });

    case 'SQLITE_CONSTRAINT_FOREIGNKEY':
      return res.status(409).json({
        success: false,
        errorCode: 'DB_FOREIGN_KEY_VIOLATION',
        message: 'Foreign key constraint violated. Related data may be missing.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });

    case 'SQLITE_BUSY':
      return res.status(503).json({
        // 503 Service Unavailable
        success: false,
        errorCode: 'DB_BUSY',
        message: 'Database is busy. Please try again in a moment.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });

    // Add more SQLite error codes as needed
  }

  // 3. Default fallback for other unhandled errors
  // These are likely unexpected programming errors
  return res.status(500).json({
    success: false,
    errorCode: 'INTERNAL_SERVER_ERROR', // Use a generic code from your constants
    message: 'An unexpected internal server error occurred.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined, // Only in dev
  });
}
