CREATE SCHEMA IF NOT EXISTS events;
CREATE TABLE IF NOT EXISTS "events" (
		"id" serial PRIMARY KEY NOT NULL,
		"event_type" TEXT NOT NULL,
		"user_id" INTEGER,
		"system_id" INTEGER,
		"event_data" JSONB NOT NULL,
		"created_at" TIMESTAMPTZ DEFAULT now( ) NOT NULL,
		"updated_at" TIMESTAMPTZ DEFAULT now( ) NOT NULL 
	);

-- partition table
CREATE TABLE IF NOT EXISTS "events_partition" (LIKE events INCLUDING DEFAULTS ) PARTITION BY RANGE ( "created_at" );

-- partitions
CREATE TABLE "events"."events_partition_2024_07" PARTITION OF "public"."events_partition" 
FOR VALUES FROM ( '2024-07-01 00:00:00' ) TO ( '2024-08-01 00:00:00' );

CREATE TABLE "events"."events_partition_2024_08" PARTITION OF "public"."events_partition" 
FOR VALUES FROM ( '2024-08-01 00:00:00' ) TO ( '2024-09-01 00:00:00' );

CREATE TABLE "events"."events_partition_2024_09" PARTITION OF "public"."events_partition" 
FOR VALUES FROM ( '2024-09-01 00:00:00' ) TO ( '2024-10-01 00:00:00' );

CREATE TABLE "events"."events_partition_2024_10" PARTITION OF "public"."events_partition" 
FOR VALUES FROM ( '2024-10-01 00:00:00' ) TO ( '2024-11-01 00:00:00' );

-- indexes
CREATE INDEX IF NOT EXISTS idx_event_created_at ON events ( created_at );
CREATE INDEX IF NOT EXISTS idx_id_event ON events ( ID );