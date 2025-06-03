DROP TABLE `users_table`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_case_table` (
	`case_type` text NOT NULL,
	`s_no` integer NOT NULL,
	`place_of_filing` text DEFAULT 'NAG' NOT NULL,
	`year_of_filing` integer NOT NULL,
	`case_no` text PRIMARY KEY NOT NULL,
	`filed_by` text,
	`bench_type` text,
	`appellant_name` text,
	`respondant_name` text,
	`assessment_year` text,
	`assessed_section` text,
	`disputed_amount` real,
	`argued_by` text,
	`case_status` text,
	`case_result` text,
	`date_of_order` text,
	`date_of_filing` text,
	`pan` text,
	`authorised_representative` text,
	`notes` text,
	`is_detail_present` integer DEFAULT 0,
	`needs_review` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_case_table`("case_type", "s_no", "place_of_filing", "year_of_filing", "case_no", "filed_by", "bench_type", "appellant_name", "respondant_name", "assessment_year", "assessed_section", "disputed_amount", "argued_by", "case_status", "case_result", "date_of_order", "date_of_filing", "pan", "authorised_representative", "notes", "is_detail_present", "needs_review", "created_at", "updated_at") SELECT "case_type", "s_no", "place_of_filing", "year_of_filing", "case_no", "filed_by", "bench_type", "appellant_name", "respondant_name", "assessment_year", "assessed_section", "disputed_amount", "argued_by", "case_status", "case_result", "date_of_order", "date_of_filing", "pan", "authorised_representative", "notes", "is_detail_present", "needs_review", "created_at", "updated_at" FROM `case_table`;--> statement-breakpoint
DROP TABLE `case_table`;--> statement-breakpoint
ALTER TABLE `__new_case_table` RENAME TO `case_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `case_table_case_no_unique` ON `case_table` (`case_no`);