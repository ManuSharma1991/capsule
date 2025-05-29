// packages/backend/src/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'sqlite3';
import * as mainSchemaCollection from './schema/main'; // Imports all exports from main/index.ts
// import * as stagingSchemaCollection from './schema/staging'; // Imports all exports from staging/index.ts
// import config from '../config'; // Your application config

// For Main DB
// const mainSqlite = new Database(config.db.mainPath);
// export const dbMain = drizzle(mainSqlite, { schema: mainSchemaCollection, logger: config.env === 'development' });

// For Staging DB
// const stagingSqlite = new Database(config.db.stagingPath);
// export const dbStaging = drizzle(stagingSqlite, { schema: stagingSchemaCollection, logger: config.env === 'development' });