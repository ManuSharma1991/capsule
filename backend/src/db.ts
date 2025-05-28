import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';
// Note: For types from shared, we'll use the path alias
// import { User } from '@shared/types'; // Example, not used directly in this db.ts

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let db: Database | null = null;

export const getDbConnection = async () => {
    if (db) return db;

    const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/database.sqlite');
    console.log(`[Server] Connected to SQLite database at: ${dbPath}`);

    try {
        db = await open({ filename: dbPath, driver: sqlite3.Database });
        console.log('[Server] Connected to the SQLite database.');
        return db;
    } catch (err: any) {
        console.error('[Server] Error connecting to SQLite:', err.message);
        process.exit(1);
    }
}