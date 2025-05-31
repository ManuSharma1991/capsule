import { sql } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const caseTable = sqliteTable("case_table", {
    // Standard auto-incrementing primary key

    // one of {"ITA","MA","SA"}
    case_type: text("case_type", { enum: ['ITA', 'MA', 'SA'] }).notNull(),

    // starts form 1, auto incremented, resets every year
    // NOTE: The 'resets every year' behavior cannot be enforced purely in the SQL schema
    // with standard auto-increment. This will require application-level logic to determine
    // the next s_no based on the current year and place_of_filing.
    s_no: int("s_no").notNull(),

    // defaults to "NAG", is a 3 letter code
    place_of_filing: text("place_of_filing").notNull().default('NAG'),

    // year in YYYY format
    year_of_filing: int("year_of_filing").notNull(),

    // concatenation of case_type, s_no, place_of_filing and year_of_filing
    // format: case_type s_no/place_of_filing/year_of_filing
    // NOTE: This is a derived/generated value and cannot be automatically
    // constructed by the database schema itself. It must be generated in your
    // application code before inserting/updating the record.
    // We add a unique constraint assuming the combination of its parts makes it unique.
    case_no: text("case_no").notNull().unique().primaryKey(),

    // either "ASSESSEE" or "DEPARTMENT"
    filed_by: text("filed_by", { enum: ['ASSESSEE', 'DEPARTMENT'] }).notNull(),

    // either "DB" or "SMC"
    bench_type: text("bench_type", { enum: ['DB', 'SMC'] }).notNull(),

    // string
    appellant_name: text("appellant_name").notNull(),

    // string
    respondant_name: text("respondant_name").notNull(),

    // financial year in the format YYYY-YY (e.g., 2023-24)
    assessment_year: text("assessment_year").notNull(),

    // string (can be null)
    assessed_section: text("assessed_section"),

    // number (using real for potential decimal amounts)
    disputed_amount: real("disputed_amount").notNull(),

    // either "CIT(DR)" or "Sr DR"
    argued_by: text("argued_by", { enum: ['CIT(DR)', 'Sr DR'] }).notNull(),

    // one of "PENDING", "HEARD", "COMPLETED"
    case_status: text("case_status", { enum: ['PENDING', 'HEARD', 'COMPLETED'] }).notNull(),

    // one of "ALLOWED", "PARTLY ALLOWED", "DISMISSED" (can be null initially)
    case_result: text("case_result", { enum: ['ALLOWED', 'PARTLY ALLOWED', 'DISMISSED'] }),

    // date (can be null if order not yet passed)
    // Recommended to store dates as ISO 8601 text (e.g., "YYYY-MM-DD") or unix timestamp (int)
    date_of_order: text("date_of_order"),

    // date (must be provided)
    // Recommended to store dates as ISO 8601 text (e.g., "YYYY-MM-DD") or unix timestamp (int)
    date_of_filing: text("date_of_filing").notNull(),

    // 10 character alphanumeric string (LLL LL 9999 L format usually handled by app logic)
    pan: text("pan").notNull(),

    // string (can be null)
    authorised_representative: text("authorised_representative"),

    // notes (can be null)
    notes: text("notes"),
    is_detail_present: int("is_detail_present").default(0).notNull(),
    needs_review: int("needs_review").default(0).notNull(),
    created_at: int("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
    updated_at: int("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).$onUpdate(() => sql`(strftime('%s', 'now'))`).notNull(),
});
