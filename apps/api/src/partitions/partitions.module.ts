import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres'; // Correct way to import postgres function
import { PartitionsService } from './partitions.service';
import { PartitionsController } from './partitions.controller';

@Global()
@Module({
  providers: [
    PartitionsService,
    {
      provide: 'DRIZZLE_CONNECTION',
      useFactory: () => {
        // Initialize postgres client and Drizzle ORM connection
        const client = postgres({
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: 'postgres',
          database: 'subtubes',
        });

        // Create Drizzle instance
        const db = drizzle(client);
        return db;
      },
    },
  ],
  controllers: [PartitionsController],
  exports: ['DRIZZLE_CONNECTION'], // Export the connection so it can be used elsewhere
})
export class PartitionsModule {}
