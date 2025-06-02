import { AUTH_ERROR_CODES } from "../utils/constants";


export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean; // To distinguish from unexpected programming errors

    constructor(message: string, statusCode: number, errorCode: string, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        // Ensuring the correct prototype chain
        Object.setPrototypeOf(this, AppError.prototype);
        // Capturing stack trace, excluding constructor call from it (if supported)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Specific Error instances
export class UserExistsError extends AppError {
    constructor(message: string, errorCode: string = AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMP_ID) {
        super(message, 409, errorCode); // 409 Conflict
    }
}

export class EmailExistsError extends AppError {
    constructor(message: string = "An account with this email already exists.") {
        super(message, 409, AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMAIL);
    }
}

// You would have more like BadRequestError, NotFoundError, UnauthorizedError, etc.