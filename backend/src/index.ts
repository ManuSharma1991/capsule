import app from './server'; // Import the configured Express app
import path from 'path';
import fs from 'fs';

// --- Configuration ---
const PORT: number = parseInt(process.env.PORT || '10000', 10);
const HOST: string = process.env.HOST || '0.0.0.0'; // Listen on all available network interfaces

// --- Database Initialization (Example for SQLite) ---
// You would typically initialize your SQLite connection here
// For example, using 'better-sqlite3' or 'sqlite3'
// import Database from 'better-sqlite3';
// const dbPath = path.join(__dirname, '..', '..', 'data', 'capsule.db'); // Adjust path if needed
// Make sure the data directory exists
// const dataDir = path.dirname(dbPath);
// if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir, { recursive: true });
// }
// export const db = new Database(dbPath, { verbose: console.log });
// console.log(`SQLite database connected at ${dbPath}`);
// db.exec("CREATE TABLE IF NOT EXISTS managed_apps (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, config TEXT)");


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
    process.on(signal, () => {
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        server.close(() => {
            console.log('HTTP server closed.');
            // Close database connection if you have one
            // if (db && db.open) {
            //     db.close();
            //     console.log('Database connection closed.');
            // }
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