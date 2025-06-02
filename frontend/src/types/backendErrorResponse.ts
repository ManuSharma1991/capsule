export interface BackendErrorResponse {
    statusCode: number; // HTTP status code
    errorCode: string; // Custom error code for the application
    message: string; // Human-readable error message
    details?: string; // Optional field for additional error details
}