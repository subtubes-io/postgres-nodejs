import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';

// Define the projects table with a JSONB field for settings
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  settings: jsonb('settings').notNull(), // JSONB field for project settings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
