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

// Export the tables for use in migrations and queries
export const schema = {
  content,
}; 