import { AUTH_ERROR_CODES } from './constants';

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean; // To distinguish from unexpected programming errors

    constructor(
        message: string,
        statusCode: number,
        errorCode: string = 'INTERNAL_SERVER_ERROR',
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        // Ensuring the correct prototype chain
        Object.setPrototypeOf(this, ApiError.prototype);
        // Capturing stack trace, excluding constructor call from it (if supported)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Specific Error instances
export class ApiUserExistsError extends ApiError {
    constructor(message: string, errorCode: string = AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMP_ID) {
        super(message, 409, errorCode); // 409 Conflict
    }
}

export class ApiEmailExistsError extends ApiError {
    constructor(message: string = 'An account with this email already exists.') {
        super(message, 409, AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMAIL);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad Request', errorCode: string = 'BAD_REQUEST') {
        super(message, 400, errorCode);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Not Found', errorCode: string = 'NOT_FOUND') {
        super(message, 404, errorCode);
    }
}
