import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Post()
  async createProject(@Body() projectData: any) {
    return this.projectsService.createProject(projectData);
  }
}
