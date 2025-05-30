import winston from 'winston';


const logger = new (winston.Logger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'backend.log' })
    ]
});

export default logger;

// In your app.ts or controllers/services:
// import logger from './logger';
// import { createLogger } from 'winston';
// logger.info('User logged in', { userId: user.id });
// logger.error('Database connection failed:', error);
// logger.debug('Request body:', req.body);