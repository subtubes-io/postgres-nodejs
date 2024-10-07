CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"user_id" integer,
	"system_id" integer,
	"event_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);


CREATE TABLE IF NOT EXISTS "events_partition" (
	"id" serial NOT NULL,
	"event_type" text NOT NULL,
	"user_id" integer,
	"system_id" integer,
	"event_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
) PARTITION BY RANGE ("created_at"); 


CREATE TABLE events_partition_2024_10 PARTITION OF events_partition FOR VALUES FROM ('2024-10-01 00:00:00') TO ('2024-11-01 00:00:00');



