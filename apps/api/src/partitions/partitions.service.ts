import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'; // Import your database type

@Injectable()
export class PartitionsService {
  constructor(
    @Inject('DRIZZLE_CONNECTION') private readonly db: PostgresJsDatabase,
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
}
