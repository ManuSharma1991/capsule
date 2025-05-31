import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import logger from './src/utils/logger';

logger.info("Drizzle Kit configuration loaded");
logger.info("Using database file:", process.env.PRODUCTION_DB_FILE_NAME);

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/schema/main/index.ts'],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.PRODUCTION_DB_FILE_NAME!,
  },
});
