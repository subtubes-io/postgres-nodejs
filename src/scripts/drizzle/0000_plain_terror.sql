


CREATE TABLE IF NOT EXISTS "users" (
		"id" serial PRIMARY KEY NOT NULL,
		"username" TEXT NOT NULL,
		"email" TEXT NOT NULL UNIQUE,
		"created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
		"updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
	);



CREATE SCHEMA IF NOT EXISTS events;
CREATE TABLE IF NOT EXISTS "events" (
		"id" serial PRIMARY KEY NOT NULL,
		"event_type" TEXT NOT NULL,
		"user_id" INTEGER,
		"system_id" INTEGER,
		"event_data" JSONB NOT NULL,
		"created_at" TIMESTAMPTZ DEFAULT now( ) NOT NULL,
		"updated_at" TIMESTAMPTZ DEFAULT now( ) NOT NULL,
		CONSTRAINT fk_user_id FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
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


-- function to sync events with event_parition table


CREATE OR REPLACE FUNCTION sync_events_partition()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO events_partition (id, event_type, user_id, system_id, event_data, created_at, updated_at)
        VALUES (NEW.id, NEW.event_type, NEW.user_id, NEW.system_id, NEW.event_data, NEW.created_at, NEW.updated_at);

    -- Handle UPDATE operation
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE events_partition
        SET event_type = NEW.event_type,
            user_id = NEW.user_id,
            system_id = NEW.system_id,
            event_data = NEW.event_data,
            created_at = NEW.created_at,
            updated_at = NEW.updated_at
        WHERE id = OLD.id;

    -- Handle DELETE operation
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM events_partition WHERE id = OLD.id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


---


-- trigger for the data sync 

CREATE TRIGGER sync_events_trigger
AFTER INSERT OR UPDATE OR DELETE ON events
FOR EACH ROW
EXECUTE FUNCTION sync_events_partition();



