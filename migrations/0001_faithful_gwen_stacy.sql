ALTER TABLE `content` ADD `theme` text DEFAULT 'light';--> statement-breakpoint
ALTER TABLE `projects` ADD `image_id` integer REFERENCES media(id);