import { RequestHandler } from 'express';

export const tryCatchWrapper = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};