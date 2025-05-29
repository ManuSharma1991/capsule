import app from './server'; // Import the configured Express app
import path from 'path';
import fs from 'fs';

// --- Configuration ---
const PORT: number = parseInt(process.env.PORT || '10000', 10);
const HOST: string = process.env.HOST || '0.0.0.0'; // Listen on all available network interfaces


// --- Start the Server ---
const server = app.listen(PORT, HOST, () => {
    console.log(`Capsule backend server running on http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// --- Graceful Shutdown ---
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;

signals.forEach((signal) => {
    process.on(signal, async () => {
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        server.close(async () => {
            console.log('HTTP server closed.');
        });

        // Force shutdown if server hasn't closed in time
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000); // 10 seconds timeout
    });
});

export default server; // Optional: export for testing purposes