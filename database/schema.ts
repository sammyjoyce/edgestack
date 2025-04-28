import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the schema for the content table
export const content = sqliteTable('content', {
  key: text('key').primaryKey().notNull(), // Text primary key
  value: text('value').notNull(), // Text value for content
});

// Type for content entry
export type Content = {
  key: string;
  value: string;
};

// Define the schema for the projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }), // Auto-incrementing integer ID
  title: text('title').notNull(),
  description: text('description'),
  details: text('details'), // Optional field for location, duration, budget etc.
  imageUrl: text('image_url'), // Optional image URL
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
