import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { caseTable } from './stagedCase.schema';
import { createSelectSchema } from 'drizzle-zod';

export const hearingsTable = sqliteTable('hearings', {
  id: integer('id').primaryKey({ autoIncrement: true }), // Unique ID for the hearing
  case_no: text('case_no')
    .notNull()
    .references(() => caseTable.case_no), // Foreign key to Main DB's caseTable
  hearing_date: text('hearing_date').notNull(), // ISO 8601 date "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS"
  remarks: text('remarks'),
}, (table) => [
  unique('uq_case_hearing_date').on(table.case_no, table.hearing_date)
]);


export type HearingTable = typeof hearingsTable.$inferInsert;
export const selectStagedHearingSchema = createSelectSchema(hearingsTable);

