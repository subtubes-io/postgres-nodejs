import { IsNotEmpty, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class SeedEventDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  seedCount: number;
}
