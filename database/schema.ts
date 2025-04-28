import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the schema for the content table
export const content = sqliteTable('content', {
  key: text('key').primaryKey().notNull(), // Text primary key
  page: text('page').notNull().default('global'), // Logical page this content belongs to
  type: text('type').notNull().default('text'),   // Content type (text, image, markdown, etc.)
  value: text('value').notNull(),                 // Content value
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(new Date()), // Last update timestamp
});

// Type for content entry
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;

// Define the schema for the projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }), // Auto-incrementing integer ID
  title: text('title').notNull(),
  description: text('description'),
  details: text('details'), // Optional field for location, duration, budget etc.
  imageUrl: text('image_url'), // Optional image URL
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false), // Flag for home page display
  sortOrder: integer('sort_order').default(0), // Order on home page
  createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()), // Timestamp for creation
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(new Date()), // Timestamp for last update
});

// Type for project entry
export type Project = typeof projects.$inferSelect; // Drizzle's inferred select type
export type NewProject = typeof projects.$inferInsert; // Drizzle's inferred insert type


// Export the tables for use in migrations and queries
export const schema = {
  content,
  projects, // Add projects table to the schema
};
