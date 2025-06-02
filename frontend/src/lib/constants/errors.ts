// Backend Error Codes/Messages (these should match what your backend might send)
export const AUTH_ERROR_CODES = {
    // User/Account related
    USER_ALREADY_EXISTS_EMP_ID: 'USER_ALREADY_EXISTS_EMP_ID',
    USER_ALREADY_EXISTS_EMAIL: 'USER_ALREADY_EXISTS_EMAIL',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // For empId/password mismatch

    // Password related
    PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK', // If backend has password strength rules
    INCORRECT_OLD_PASSWORD: 'INCORRECT_OLD_PASSWORD',

    // Token related
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // General/Server
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR', // Could be a client-side deduction
    VALIDATION_ERROR: 'VALIDATION_ERROR', // If backend sends a generic validation error code
} as const; // 'as const' makes the values literal types, useful for type checking

// Frontend-Friendly Messages mapped to Error Codes
// You can also internationalize these later if needed (i18n)
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
    [AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMP_ID]: "User already exists with this employee ID.",
    [AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMAIL]: "An account with this email already exists.",
    [AUTH_ERROR_CODES.USER_NOT_FOUND]: "Employee ID not found. Please check and try again.",
    [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: "Invalid employee ID or password.",
    [AUTH_ERROR_CODES.PASSWORD_TOO_WEAK]: "The password does not meet the strength requirements.",
    [AUTH_ERROR_CODES.INCORRECT_OLD_PASSWORD]: "The old password provided is incorrect.",
    [AUTH_ERROR_CODES.TOKEN_INVALID]: "Your session is invalid. Please log in again.",
    [AUTH_ERROR_CODES.TOKEN_EXPIRED]: "Your session has expired. Please log in again.",
    [AUTH_ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Please try again later.",
    [AUTH_ERROR_CODES.NETWORK_ERROR]: "Network error. Please check your connection and try again.",
    [AUTH_ERROR_CODES.VALIDATION_ERROR]: "Please correct the errors in the form.",
    DEFAULT: "An unexpected error occurred. Please try again.",
};

// General Error Messages
export const GENERAL_ERROR_MESSAGES = {
    UNEXPECTED: "An unexpected error occurred. Please try again.",
    FORM_VALIDATION: "Please correct the highlighted errors.",
};