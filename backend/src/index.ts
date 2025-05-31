import app from './server';
import logger from './utils/logger';
import { prodDb, stagingDb } from './db'; // Update this to wherever you defined your DBs

const PORT: number = parseInt(process.env.PORT || '10000', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    logger.info(`✅ Capsule backend running at http://${HOST}:${PORT}`);
    console.log(`✅ Capsule backend running at http://${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;

shutdownSignals.forEach((signal) => {
    process.on(signal, async () => {
        console.log(`\n📦 Received ${signal}. Initiating graceful shutdown...`);

        server.close(async () => {
            console.log('🛑 HTTP server closed.');

            // --- Close DB connections ---
            try {
                if (prodDb) {
                    await (prodDb as any).session?.client?.close?.(); // Optional chaining if client exists
                    console.log('🔌 Closed production DB connection.');
                }
                if (stagingDb) {
                    await (stagingDb as any).session?.client?.close?.();
                    console.log('🔌 Closed staging DB connection.');
                }
            } catch (err) {
                console.error('⚠️ Error during DB cleanup:', err);
            }

            process.exit(0);
        });

        // Force shutdown if it takes too long
        setTimeout(() => {
            console.error('⏱️ Timeout: Could not close connections in time. Forcing shutdown.');
            process.exit(1);
        }, 10000);
    });
});

export default server;
