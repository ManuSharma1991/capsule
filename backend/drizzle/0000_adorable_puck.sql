CREATE TABLE `case_table` (
	`case_type` text NOT NULL,
	`s_no` integer NOT NULL,
	`place_of_filing` text DEFAULT 'NAG' NOT NULL,
	`year_of_filing` integer NOT NULL,
	`case_no` text PRIMARY KEY NOT NULL,
	`filed_by` text NOT NULL,
	`bench_type` text NOT NULL,
	`appellant_name` text NOT NULL,
	`respondant_name` text NOT NULL,
	`assessment_year` text NOT NULL,
	`assessed_section` text,
	`disputed_amount` real NOT NULL,
	`argued_by` text NOT NULL,
	`case_status` text NOT NULL,
	`case_result` text,
	`date_of_order` text,
	`date_of_filing` text NOT NULL,
	`pan` text NOT NULL,
	`authorised_representative` text,
	`notes` text,
	`is_detail_present` integer DEFAULT 0 NOT NULL,
	`needs_review` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_table_case_no_unique` ON `case_table` (`case_no`);--> statement-breakpoint
CREATE TABLE `hearings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`case_no` text NOT NULL,
	`hearing_date` text NOT NULL,
	`remarks` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`case_no`) REFERENCES `case_table`(`case_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`empId` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_empId_unique` ON `users_table` (`empId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);