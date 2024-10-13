SELECT
    child.relname AS partition_table,
    parent.relname AS parent_table,
    pg_size_pretty(pg_total_relation_size(child.oid)) AS partition_table_size,
    -- to_char(COALESCE(pg_stat_user_tables.n_live_tup, 0), 'FM999,999,999,999') AS row_count
    COALESCE(pg_stat_user_tables.n_live_tup, 0)
FROM
    pg_inherits
JOIN 
    pg_class child ON pg_inherits.inhrelid = child.oid
JOIN 
    pg_class parent ON pg_inherits.inhparent = parent.oid
LEFT JOIN 
    pg_stat_user_tables ON pg_stat_user_tables.relid = child.oid
WHERE
    parent.relkind = 'p' 
ORDER BY
    partition_table;
