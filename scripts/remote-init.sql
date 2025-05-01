-- Combined initialization script for remote database

-- Initial schema from drizzle/0000_wide_baron_strucker.sql
CREATE TABLE IF NOT EXISTS `content` (
	`key` text PRIMARY KEY NOT NULL,
	`page` text DEFAULT 'global' NOT NULL,
	`section` text DEFAULT 'default',
	`type` text DEFAULT 'text' NOT NULL,
	`value` text NOT NULL,
	`media_id` integer,
	`sort_order` integer DEFAULT 0,
	`metadata` text,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`details` text,
	`image_url` text,
	`slug` text,
	`published` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS `projects_slug_unique` ON `projects` (`slug`);
