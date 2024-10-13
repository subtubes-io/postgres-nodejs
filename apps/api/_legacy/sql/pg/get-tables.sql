SELECT
    child.relname AS table_name,
    parent.relname AS parent_table,
    pg_size_pretty(pg_total_relation_size(child.oid)) AS table_size,
    COALESCE(pg_stat_user_tables.n_live_tup, 0) AS row_count,
    CASE
        WHEN parent.relname IS NOT NULL THEN 'partition'
        ELSE 'normal'
    END AS table_type
FROM
    pg_class child
LEFT JOIN
    pg_inherits ON pg_inherits.inhrelid = child.oid
LEFT JOIN
    pg_class parent ON pg_inherits.inhparent = parent.oid
LEFT JOIN
    pg_stat_user_tables ON pg_stat_user_tables.relid = child.oid
LEFT JOIN
    pg_partitioned_table p ON child.oid = p.partrelid
WHERE
    child.relname LIKE 'events%' 
    AND child.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND child.relkind IN ('r', 'p') 
ORDER BY
    table_name;
