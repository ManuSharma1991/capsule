import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = drizzle(process.env.STAGING_DB_FILE_NAME!);

