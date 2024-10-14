import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsString()
  //@IsNotEmpty({ message: 'Project description is required' })
  @IsOptional()
  description: string;

  @IsObject({ message: 'Settings must be an object' })
  // @IsNotEmpty({ message: 'Settings are required' })
  @IsOptional()
  settings: Record<string, any> = {}; // Settings will now be validated as an object
}
