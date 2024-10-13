SELECT
    confrel.relname AS referenced_table,
    conname AS constraint_name,
    conrel.relname AS referencing_table,
    a.attname AS referencing_column
FROM
    pg_constraint con
JOIN 
    pg_class confrel ON confrel.oid = con.confrelid  -- Referenced table (foo)
JOIN 
    pg_class conrel ON conrel.oid = con.conrelid  -- Referencing table
JOIN 
    pg_attribute a ON a.attnum = ANY(con.conkey) AND a.attrelid = con.conrelid
WHERE
    con.contype = 'f'  -- Foreign key
    AND confrel.relname = 'users';  -- Replace with your referenced table name
