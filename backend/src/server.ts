// src/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { swaggerOptions } from './swaggerConfig';
import { errorHandler } from './middleware/errorHandler';
import caseRoutes from './api/cases/cases.routes';
import authRoutes from './api/auth/auth.routes';
import { authenticateToken } from './middleware/isAuthenticated';

// --- Load Environment Variables ---
dotenv.config();

// --- Initialize App ---
const app: Express = express();

// --- Swagger Setup ---
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- CORS ---
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_FRONTEND_URL // replace or remove depending on deployment
        : 'http://localhost:5173',
    credentials: true,
}));

// --- Body Parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Health Check ---
app.get('/api/health', (req: Request, res: Response) => {
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, './db/database.sqlite');
    res.status(200).json({
        status: 'UP',
        message: `Capsule backend is healthy! Using DB at: ${dbPath}`
    });
});

// --- API Routes ---

app.use('/api/auth', authRoutes); // Assuming auth.routes exports a router
app.use('/api/cases', authenticateToken, caseRoutes);

// --- Error Handler ---
app.use(errorHandler); // Custom handler for known errors

// --- Serve Frontend (Production Only) ---
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '..', 'frontend_build');
    app.use(express.static(frontendBuildPath));

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    app.get('/', (req: Request, res: Response) => {
        res.send('Capsule Backend in Development. Frontend likely runs on another port.');
    });
}

// --- Catch-All for Unhandled Errors ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err.stack || err.message);

    const statusCode = (err as any).status || 500;
    const isProd = process.env.NODE_ENV === 'production';

    res.status(statusCode).json({
        error: true,
        message: isProd && statusCode === 500
            ? 'An unexpected error occurred on the server.'
            : err.message,
        ...(isProd ? {} : { stack: err.stack }),
    });
});

export default app;
