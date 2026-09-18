CREATE TABLE `delivery_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`campaign_id` integer,
	`message_id` text,
	`recipient` text NOT NULL,
	`event_type` text NOT NULL,
	`provider_event_id` text,
	`occurred_at` text NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `delivery_events_provider_event_id_unique` ON `delivery_events` (`provider_event_id`);--> statement-breakpoint
CREATE INDEX `idx_delivery_events_campaign_time` ON `delivery_events` (`campaign_id`,`occurred_at`);--> statement-breakpoint
ALTER TABLE `campaigns` ADD `subject` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `sent_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `delivered_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `opened_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `clicked_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `replied_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` ADD `bounced_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `templates` ADD `preheader` text DEFAULT '' NOT NULL;