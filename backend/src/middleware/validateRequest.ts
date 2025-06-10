import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';

type DataSource = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodSchema, dataSource: DataSource) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req[dataSource]);

            if (!result.success) {
                const errorMessages = result.error.errors.map((err: ZodError['errors'][0]) => {
                    return `${err.path.join('.')}: ${err.message}`;
                }).join(', ');
                logger.error(`Validation failed for ${dataSource}:`, errorMessages);
                throw new ApiError(`Validation Error: ${errorMessages}`, 400);
            }

            // Optionally, you can attach the validated data to the request object
            // req.validatedData = result.data;

            next();
        } catch (error) {
            next(error);
        }
    };
