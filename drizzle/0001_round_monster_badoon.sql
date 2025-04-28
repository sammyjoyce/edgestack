CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT '"2025-04-28T15:47:31.305Z"'
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`details` text,
	`image_url` text,
	`slug` text,
	`published` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`created_at` integer DEFAULT '"2025-04-28T15:47:31.305Z"',
	`updated_at` integer DEFAULT '"2025-04-28T15:47:31.305Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
ALTER TABLE `content` ADD `page` text DEFAULT 'global' NOT NULL;--> statement-breakpoint
ALTER TABLE `content` ADD `section` text DEFAULT 'default';--> statement-breakpoint
ALTER TABLE `content` ADD `type` text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE `content` ADD `media_id` integer REFERENCES media(id);--> statement-breakpoint
ALTER TABLE `content` ADD `sort_order` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `content` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `content` ADD `updated_at` integer DEFAULT '"2025-04-28T15:47:31.304Z"';