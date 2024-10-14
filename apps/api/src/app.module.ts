import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres'; // Correct way to import postgres function
import { PartitionsModule } from './partitions/partitions.module';
import { ProjectsModule } from './projects/projects.module';

@Global()
@Module({
  // imports: [SchedulerModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'MIXIETAPE_CONNECTION',
      useFactory: () => {
        // Initialize postgres client and Drizzle ORM connection
        const client = postgres({
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: 'postgres',
          database: 'mixietape',
        });

        // Create Drizzle instance
        const db = drizzle(client);
        return db;
      },
    },
    {
      provide: 'PROJECT_CONNECTION',
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
  imports: [PartitionsModule, ProjectsModule],
  exports: ['MIXIETAPE_CONNECTION', 'PROJECT_CONNECTION'],
})
export class AppModule {}
