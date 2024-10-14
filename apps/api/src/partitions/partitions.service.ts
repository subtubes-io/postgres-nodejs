import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'; // Import your database type

@Injectable()
export class PartitionsService {
  constructor(
    @Inject('PROJECT_CONNECTION') private readonly db: PostgresJsDatabase,
  ) {}

  async getPartitions() {
    const sqlQuery = `
        SELECT
            child.relname AS tableName,
            parent.relname AS parentTable,
            pg_size_pretty ( pg_total_relation_size ( child.OID ) ) AS tableSize,
            COALESCE ( pg_stat_user_tables.n_live_tup, 0 )::INTEGER  AS rowCount,
        CASE
                
                WHEN parent.relname IS NOT NULL THEN
                'partition' ELSE'normal' 
            END AS tabletype 
        FROM
            pg_class child
            LEFT JOIN pg_inherits ON pg_inherits.inhrelid = child.
            OID LEFT JOIN pg_class parent ON pg_inherits.inhparent = parent.
            OID LEFT JOIN pg_stat_user_tables ON pg_stat_user_tables.relid = child.
            OID LEFT JOIN pg_partitioned_table P ON child.OID = P.partrelid 
        WHERE
            child.relname LIKE'events_%' 
            AND child.relnamespace IN ( ( SELECT OID FROM pg_namespace WHERE nspname IN ( 'public', 'events' ) ) ) 
            AND child.relkind IN ( 'r', 'p' ) 
        ORDER BY
            tableName;
    `;

    try {
      const result = await this.db.execute(sqlQuery);
      return result; // Handle result accordingly
    } catch (error) {
      throw new Error(`Error executing raw SQL: ${error.message}`);
    }
  }

  async getIndexes() {
    const sqlQuery = `
        SELECT T
            .relname AS tableName,-- Adding the table name
            i.relname AS indexName,
            A.attname AS columnName,
            ix.indisunique AS isUnique,
            ix.indisprimary AS isPrimary 
        FROM
            pg_class
            T JOIN pg_index ix ON T.OID = ix.indrelid
            JOIN pg_class i ON i.OID = ix.indexrelid
            JOIN pg_attribute A ON A.attnum = ANY ( ix.indkey ) 
            AND A.attrelid = T.OID 
        WHERE
            T.relname LIKE'events%' -- Filter to include only event-related tables
            
        ORDER BY
            tableName,-- Order by table name to make results more readable
            indexName,
            A.attnum;
    `;

    try {
      const result = await this.db.execute(sqlQuery);
      return result; // Handle result accordingly
    } catch (error) {
      throw new Error(`Error executing raw SQL: ${error.message}`);
    }
  }

  async getForeignKeyRefs() {
    const sqlQuery = `
        SELECT
            confrel.relname AS referencedtable,
            conname AS constraintname,
            conrel.relname AS referencingtable,
            A.attname AS referencingcolumn 
        FROM
            pg_constraint con
            JOIN pg_class confrel ON confrel.OID = con.confrelid -- Referenced table (foo)
            JOIN pg_class conrel ON conrel.OID = con.conrelid -- Referencing table
            JOIN pg_attribute A ON A.attnum = ANY ( con.conkey ) 
            AND A.attrelid = con.conrelid 
        WHERE
            con.contype = 'f' -- Foreign key
            
            AND confrel.relname LIKE'users%';
    `;

    try {
      const result = await this.db.execute(sqlQuery);
      return result; // Handle result accordingly
    } catch (error) {
      throw new Error(`Error executing raw SQL: ${error.message}`);
    }
  }

  async getTriggerRefs() {
    const sqlQuery = `
            SELECT
                tg.tgname AS triggername,
                pg_proc.proname AS functionname,
                pg_get_functiondef ( pg_proc.OID ) AS functiondefinition,
            CASE
                    
                    WHEN tg.tgtype & 1 = 1 THEN
                    'AFTER' 
                    WHEN tg.tgtype & 1 = 0 THEN
                    'BEFORE' ELSE'INSTEAD OF' 
                END AS triggertype,
                ARRAY [
            CASE
                    
                    WHEN tg.tgtype & 2 = 2 THEN
                    'INSERT' ELSE NULL 
                END,
            CASE
                
                WHEN tg.tgtype & 4 = 4 THEN
                'DELETE' ELSE NULL 
                END,
            CASE
                
                WHEN tg.tgtype & 8 = 8 THEN
                'UPDATE' ELSE NULL 
                END,
            CASE
                
                WHEN tg.tgtype & 16 = 16 THEN
                'TRUNCATE' ELSE NULL 
                END ] AS event,
            CASE
                    
                    WHEN tg.tgtype & 64 = 64 THEN
                    'ROW' ELSE'STATEMENT' 
            END AS LEVEL 
            FROM
                pg_trigger tg
                JOIN pg_class tbl ON tg.tgrelid = tbl.
                OID JOIN pg_proc ON tg.tgfoid = pg_proc.OID 
            WHERE
                NOT tg.tgisinternal -- Exclude internal triggers
                AND pg_get_functiondef ( pg_proc.OID ) LIKE'%events%' -- Replace with your table name;
    `;

    try {
      const result = await this.db.execute(sqlQuery);
      return result; // Handle result accordingly
    } catch (error) {
      throw new Error(`Error executing raw SQL: ${error.message}`);
    }
  }
}
