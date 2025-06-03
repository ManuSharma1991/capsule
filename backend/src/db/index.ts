import { drizzle } from 'drizzle-orm/better-sqlite3';
import 'dotenv/config';
import Database from 'better-sqlite3';
import * as prodSchema from './schema/main/index';
import * as stagingSchema from './schema/staging/index';

const prodDBFile = process.env.PRODUCTION_DB_FILE_NAME!;
const stagingDBFile = process.env.STAGING_DB_FILE_NAME!;

export const prodDb = drizzle(new Database(prodDBFile), { schema: prodSchema });
export const stagingDb = drizzle(new Database(stagingDBFile), { schema: stagingSchema });
