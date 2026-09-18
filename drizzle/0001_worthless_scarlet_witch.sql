CREATE INDEX `idx_campaigns_status_updated_at` ON `campaigns` (`status`,`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_contacts_status` ON `contacts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_templates_updated_at` ON `templates` (`updated_at`);