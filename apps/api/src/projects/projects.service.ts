import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { projects } from '@/schema';

type NewProject = typeof projects.$inferInsert;

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('MIXIETAPE_CONNECTION') private readonly db: PostgresJsDatabase,
  ) {}

  async getAllProjects() {
    return this.db.select().from(projects).execute();
  }

  async createProject(data: NewProject) {
    return this.db.insert(projects).values(data).returning();

    //   .returning('*')
    //   .execute();
  }
}
