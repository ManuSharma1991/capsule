import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan'; // HTTP request logger middleware
import { getDbConnection } from './db';

// --- Import API Routers ---
// Example: import dockerRoutes from './api/dockerRoutes';
// Example: import appStoreRoutes from './api/appStoreRoutes';
// Example: import settingsRoutes from './api/settingsRoutes';

// --- Initialize Express App ---
const app: Express = express();

// --- Middleware ---
// Enable CORS - configure appropriately for your needs
// For development, a simple setup is fine. For production, restrict origins.
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'YOUR_PRODUCTION_FRONTEND_URL_OR_LEAVE_UNDEFINED_IF_SAME_ORIGIN' // e.g., https://capsule.yourdomain.com
        : 'http://localhost:5173', // Assuming Vite dev server runs on 5173
    credentials: true, // If you need to handle cookies/sessions
}));

// Body Parsers
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// HTTP Request Logging (Morgan)
// 'dev' format is good for development. Consider 'combined' for production.
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- API Routes ---
// Mount your API routers here
// app.use('/api/docker', dockerRoutes);
// app.use('/api/appstore', appStoreRoutes);
// app.use('/api/settings', settingsRoutes);

// Example Health Check Endpoint
app.get('/api/health', async (req: Request, res: Response) => {
    const db = await getDbConnection();
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/database.sqlite');
    res.status(200).json({ status: 'UP', message: `Capsule backend is healthy! and [Server] Connecting to SQLite database at: ${dbPath}` });
});

// --- Serve Frontend Static Files (Production Only) ---
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '..', 'frontend_build'); // Adjust if your Dockerfile copies it elsewhere

    // Serve static files from the React app
    app.use(express.static(frontendBuildPath));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    // This is important for client-side routing (React Router).
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    // Development specific message or redirect if frontend is served separately
    app.get('/', (req: Request, res: Response) => {
        res.send('Capsule Backend (Development Mode). Frontend is likely running on a different port (e.g., 5173).');
    });
}

// --- Error Handling Middleware (Basic Example) ---
// This should be the last middleware added
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err.stack || err.message); // Log the error stack for debugging

    // Avoid sending detailed error messages to the client in production
    const statusCode = (err as any).status || 500; // Use error status or default to 500
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred on the server.'
        : err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: true,
        message: message,
        // Optionally include stack in development
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});


export default app;