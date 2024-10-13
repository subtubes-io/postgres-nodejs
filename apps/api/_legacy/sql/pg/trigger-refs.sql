SELECT
    tg.tgname AS trigger_name,
    pg_proc.proname AS function_name,
    CASE
        WHEN tg.tgtype & 1 = 1 THEN 'AFTER'
        WHEN tg.tgtype & 1 = 0 THEN 'BEFORE'
        ELSE 'INSTEAD OF'
    END AS trigger_type,
    ARRAY[
        CASE 
            WHEN tg.tgtype & 2 = 2 THEN 'INSERT'
            ELSE NULL
        END,
        CASE 
            WHEN tg.tgtype & 4 = 4 THEN 'DELETE'
            ELSE NULL
        END,
        CASE 
            WHEN tg.tgtype & 8 = 8 THEN 'UPDATE'
            ELSE NULL
        END,
        CASE 
            WHEN tg.tgtype & 16 = 16 THEN 'TRUNCATE'
            ELSE NULL
        END
    ] AS event,
    CASE
        WHEN tg.tgtype & 64 = 64 THEN 'ROW'
        ELSE 'STATEMENT'
    END AS level
FROM
    pg_trigger tg
JOIN 
    pg_class tbl ON tg.tgrelid = tbl.oid
JOIN 
    pg_proc ON tg.tgfoid = pg_proc.oid
WHERE 
    NOT tg.tgisinternal  -- Exclude internal triggers
    AND tbl.relname = 'events_original';  -- Replace with your table name
