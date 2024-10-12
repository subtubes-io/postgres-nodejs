import React from "react";
import { NextPage } from "next";
import { Divider } from "@/components/catalyst/divider";
import { D3BarChart } from "@/components/charts";
import { ComponentModule } from "@/components/ComponentModule";
import ForeignKeyTable from "@/components/tables/ForeignKeys";
import IndexesTable from "@/components/tables/IndexesTable";
import TriggersTable from "@/components/tables/TriggerTable";
// import { ScheduleForm } from "@/components/custom/ScheduleForm";
// import { SeedForm } from "@/components/custom/SeedForm";

// import { StatsBar } from "@/components/custom/StatsBar";

const d = [
  {
    name: "events_partition_2024_07",
    parentName: "events",
    size: "94 MB",
    rows: 465998,
  },
  {
    name: "events_partition_2024_08",
    parentName: "events",
    size: "94 MB",
    rows: 466821,
  },
  {
    name: "events_partition_2024_09",
    parentName: "events",
    size: "91 MB",
    rows: 450796,
  },
  {
    name: "events_partition_2024_10",
    parentName: "events",
    size: "94 MB",
    rows: 466385,
  },
  {
    name: "events_partition_2024_11",
    parentName: "events",
    size: "2 MB",
    rows: 0,
  },
];

const foreignKeyData = [
  {
    referenceTable: "users",
    constraintName: "fk_user_id",
    referencingTable: "events_original",
    referencingColumn: "user_id",
  },
  {
    referenceTable: "users",
    constraintName: "fk_user_id",
    referencingTable: "other_table_example", // Replace with actual data if available
    referencingColumn: "user_id",
  },
  // Add more rows if needed
];

const indexesTableData = [
  {
    referenceTable: "events_pkey",
    constraintName: "id",
    referencingTable: "t",
    referencingColumn: "t",
  },
  {
    referenceTable: "idx_event_created_at",
    constraintName: "created_at",
    referencingTable: "f",
    referencingColumn: "f",
  },
  {
    referenceTable: "idx_id_event",
    constraintName: "id",
    referencingTable: "f",
    referencingColumn: "f",
  },
];

const triggerData = [
  {
    triggerName: "sync_events_trigger",
    functionName: "sync_events_partition",
    functionDefinition:
      "CREATE OR REPLACE FUNCTION public.sync_events_partition()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    -- Handle INSERT operation\n    IF (TG_OP = 'INSERT') THEN\n        INSERT INTO events_partition (id, event_type, user_id, system_id, event_data, created_at, updated_at)\n        VALUES (NEW.id, NEW.event_type, NEW.user_id, NEW.system_id, NEW.event_data, NEW.created_at, NEW.updated_at);\n\n    -- Handle UPDATE operation\n    ELSIF (TG_OP = 'UPDATE') THEN\n        UPDATE events_partition\n        SET event_type = NEW.event_type,\n            user_id = NEW.user_id,\n            system_id = NEW.system_id,\n            event_data = NEW.event_data,\n            created_at = NEW.created_at,\n            updated_at = NEW.updated_at\n        WHERE id = OLD.id;\n\n    -- Handle DELETE operation\n    ELSIF (TG_OP = 'DELETE') THEN\n        DELETE FROM events_partition WHERE id = OLD.id;\n    END IF;\n\n    RETURN NULL;\nEND;\n$function$",
    triggerType: "AFTER",
    event: [null, "DELETE", "UPDATE", "TRUNCATE"],
    level: "STATEMENT",
  },
  {
    triggerName: "log_insert_trigger",
    functionName: "log_events_insert",
    functionDefinition:
      "CREATE OR REPLACE FUNCTION public.log_events_insert()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    -- Log the INSERT operation\n    INSERT INTO event_logs (event_id, log_time)\n    VALUES (NEW.id, NOW());\n    RETURN NEW;\nEND;\n$function$",
    triggerType: "BEFORE",
    event: ["INSERT"],
    level: "ROW",
  },
  {
    triggerName: "audit_update_trigger",
    functionName: "audit_event_updates",
    functionDefinition:
      "CREATE OR REPLACE FUNCTION public.audit_event_updates()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    -- Audit the UPDATE operation\n    INSERT INTO audit_logs (event_id, change_time, old_data, new_data)\n    VALUES (OLD.id, NOW(), OLD.event_data, NEW.event_data);\n    RETURN NEW;\nEND;\n$function$",
    triggerType: "AFTER",
    event: ["UPDATE"],
    level: "ROW",
  },
];

const Home: NextPage = async () => {
  return (
    <>
      <ComponentModule title={"Event Table Partition"}>
        <D3BarChart data={d} />
      </ComponentModule>
      <Divider />
      <ComponentModule title={"Event Table Foreign Key Constraints"}>
        <ForeignKeyTable data={foreignKeyData} />
      </ComponentModule>

      <ComponentModule title={"Event Table Indexes"}>
        <IndexesTable data={indexesTableData} />
      </ComponentModule>

      <ComponentModule title={"Event Table Associated Triggers"}>
        <TriggersTable data={triggerData} />
      </ComponentModule>
    </>
  );
};

export default Home;
