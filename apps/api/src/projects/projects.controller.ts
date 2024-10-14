import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectsService } from '@/projects/projects.service';
import { CreateProjectDto } from '@/projects/dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    // Pass the DTO to the service for processing
    return await this.projectsService.createProject(createProjectDto);
  }
}
