CREATE TABLE `content` (
	`key` text PRIMARY KEY NOT NULL,
	`page` text DEFAULT 'global' NOT NULL,
	`section` text DEFAULT 'default',
	`type` text DEFAULT 'text' NOT NULL,
	`value` text NOT NULL,
	`media_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`metadata` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
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
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);