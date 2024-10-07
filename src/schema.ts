import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("events", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  event_type: text("event_type").notNull(), // The type of event (e.g., signup, purchase, error)
  user_id: integer("user_id"), // The ID of the user associated with the event
  system_id: integer("system_id"), // The ID of the system associated with the event
  event_data: jsonb("event_data").notNull(), // JSON data for event-specific metadata
  created_at: timestamp("created_at").defaultNow().notNull(), // Timestamp for when the event occurred
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
