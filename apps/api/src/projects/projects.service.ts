import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { projects } from '@/schema';
import { v7 as uuid } from 'uuid';

import { CreateProjectDto } from '@/projects/dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('MIXIETAPE_CONNECTION') private readonly db: PostgresJsDatabase,
  ) {}

  async getAllProjects() {
    return this.db.select().from(projects).execute();
  }

  async createProject(createProjectDto: CreateProjectDto) {
    // Parse the settings JSON string into a JavaScript object

    // Use Drizzle ORM to insert the new project
    const result = await this.db
      .insert(projects) // Assume 'projects' is the name of your table
      .values({
        id: uuid(),
        ...createProjectDto,
      })
      .returning(); // Return the inserted record

    return result;
  }
}
