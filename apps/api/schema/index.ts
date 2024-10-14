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

// Define the modules table associated with projects
export const modules = pgTable('modules', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  settings: jsonb('settings').notNull(), // JSONB field for module settings
  projectId: uuid('project_id').references(() => projects.id), // Correct foreign key reference to projects table
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'), // Soft delete column, nullable
});
