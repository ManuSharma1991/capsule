import { sql } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from 'drizzle-zod';

export const caseTable = sqliteTable("case_table", {
    case_type: text("case_type", { enum: ['ITA', 'MA', 'SA'] }).notNull(),
    s_no: int("s_no").notNull(),
    place_of_filing: text("place_of_filing").notNull().default('NAG'),
    year_of_filing: int("year_of_filing").notNull(),
    case_no: text("case_no").unique().primaryKey(),
    filed_by: text("filed_by", { enum: ['ASSESSEE', 'DEPARTMENT'] }),
    bench_type: text("bench_type", { enum: ['DB', 'SMC'] }),
    appellant_name: text("appellant_name"),
    respondant_name: text("respondant_name"),
    assessment_year: text("assessment_year"),
    assessed_section: text("assessed_section"),
    disputed_amount: real("disputed_amount"),
    argued_by: text("argued_by", { enum: ['CIT(DR)', 'Sr DR'] }),
    case_status: text("case_status"),
    case_result: text("case_result"),
    date_of_order: text("date_of_order"),
    date_of_filing: text("date_of_filing"),
    pan: text("pan"),
    authorised_representative: text("authorised_representative"),
    notes: text("notes"),
    is_detail_present: int("is_detail_present").default(0),
    needs_review: int("needs_review").default(0),
    created_at: int("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updated_at: int("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).$onUpdate(() => sql`(strftime('%s', 'now'))`),
});

export const stagedCaseSelectSchema = createSelectSchema(caseTable).omit({
    created_at: true,
    updated_at: true,
})
