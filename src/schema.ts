import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("events", {
  id: serial("id").primaryKey(),
  event_type: text("event_type").notNull(),
  user_id: integer("user_id"),
  system_id: integer("system_id"),
  event_data: jsonb("event_data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
