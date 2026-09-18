CREATE TABLE `campaigns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`template_id` integer,
	`audience` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`scheduled_at` text,
	`daily_limit` integer DEFAULT 30 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'ready' NOT NULL,
	`score` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_email_unique` ON `contacts` (`email`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`provider` text DEFAULT 'sendpulse_smtp' NOT NULL,
	`from_name` text DEFAULT 'Tironi Tech' NOT NULL,
	`from_email` text DEFAULT '' NOT NULL,
	`reply_to` text DEFAULT '' NOT NULL,
	`daily_limit` integer DEFAULT 30 NOT NULL,
	`hourly_limit` integer DEFAULT 10 NOT NULL,
	`domain_daily_limit` integer DEFAULT 2 NOT NULL,
	`interval_seconds` integer DEFAULT 360 NOT NULL,
	`send_start_hour` integer DEFAULT 9 NOT NULL,
	`send_end_hour` integer DEFAULT 17 NOT NULL,
	`require_approval` integer DEFAULT true NOT NULL,
	`dry_run` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`text_body` text NOT NULL,
	`html_body` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
