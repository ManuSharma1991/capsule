import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/schema/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.STAGING_DB_FILE_NAME!,
  },
});
