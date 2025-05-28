import app from './server'; // Import the configured Express app
import path from 'path';
import fs from 'fs';
import { getDbConnection } from './db';

// --- Configuration ---
const PORT: number = parseInt(process.env.PORT || '10000', 10);
const HOST: string = process.env.HOST || '0.0.0.0'; // Listen on all available network interfaces


// --- Start the Server ---
const server = app.listen(PORT, HOST, () => {
    console.log(`Capsule backend server running on http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // You can add a check here to ensure the Docker socket is accessible if needed
    // For example, try a simple dockerode call
});

// --- Graceful Shutdown ---
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;

signals.forEach((signal) => {
    process.on(signal, async () => {
        const db = await getDbConnection();
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        server.close(async () => {
            console.log('HTTP server closed.');
            if (db) {
                await db.open();
                db.close();
                console.log('Database connection closed.');
            }
            process.exit(0);
        });

        // Force shutdown if server hasn't closed in time
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000); // 10 seconds timeout
    });
});

export default server; // Optional: export for testing purposes