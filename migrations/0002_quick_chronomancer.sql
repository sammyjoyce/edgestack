PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_content` (
	`key` text PRIMARY KEY NOT NULL,
	`page` text DEFAULT 'global' NOT NULL,
	`section` text DEFAULT 'default',
	`type` text DEFAULT 'text' NOT NULL,
	`theme` text DEFAULT 'light',
	`value` text NOT NULL,
	`media_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_content`("key", "page", "section", "type", "theme", "value", "media_id", "sort_order", "metadata", "created_at", "updated_at") SELECT "key", "page", "section", "type", "theme", "value", "media_id", "sort_order", "metadata", "created_at", "updated_at" FROM `content`;--> statement-breakpoint
DROP TABLE `content`;--> statement-breakpoint
ALTER TABLE `__new_content` RENAME TO `content`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `content_media_id_idx` ON `content` (`media_id`);--> statement-breakpoint
CREATE TABLE `__new_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`type` text DEFAULT 'image' NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_media`("id", "url", "alt", "width", "height", "created_at", "type", "updated_at") SELECT "id", "url", "alt", "width", "height", "created_at", "type", "updated_at" FROM `media`;--> statement-breakpoint
DROP TABLE `media`;--> statement-breakpoint
ALTER TABLE `__new_media` RENAME TO `media`;--> statement-breakpoint
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`details` text,
	`image_id` integer,
	`slug` text,
	`published` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "title", "description", "details", "image_id", "slug", "published", "is_featured", "sort_order", "created_at", "updated_at") SELECT "id", "title", "description", "details", "image_id", "slug", "published", "is_featured", "sort_order", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_image_id_idx` ON `projects` (`image_id`);