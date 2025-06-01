import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import logger from './src/utils/logger';

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/schema/main/index.ts'],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.PRODUCTION_DB_FILE_NAME!,
  },
});
