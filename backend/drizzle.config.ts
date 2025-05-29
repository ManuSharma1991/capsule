import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/staging/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.PRODUCTION_DB_FILE_NAME!,
  },
});
