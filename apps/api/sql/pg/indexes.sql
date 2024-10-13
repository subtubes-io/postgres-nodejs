-- get all indexes on a table

SELECT
    i.relname AS index_name,
    a.attname AS column_name,
    ix.indisunique AS is_unique,
    ix.indisprimary AS is_primary
FROM
    pg_class t
JOIN
    pg_index ix ON t.oid = ix.indrelid
JOIN
    pg_class i ON i.oid = ix.indexrelid
JOIN
    pg_attribute a ON a.attnum = ANY(ix.indkey) AND a.attrelid = t.oid
WHERE
    t.relname = 'events_original'  -- Replace with your table name
    --AND t.relkind = 'r'  -- 'r' is for ordinary tables
ORDER BY
    index_name, a.attnum;