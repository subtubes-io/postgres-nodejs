import { IsEnum, IsNotEmpty, IsUUID, IsString } from 'class-validator';

enum ScheduleExpressionEnum {
  In1Minute = 'In1Minute',
  In1Hour = 'In1Hour',
  In2Hours = 'In2Hours',
  In3Hours = 'In3Hours',
  In4Hours = 'In4Hours',
  In5Hours = 'In5Hours',
  In5Minutes = 'In5Minutes',
  In2Minutes = 'In2Minutes',
}

export class CreateEventDto {
  @IsEnum(ScheduleExpressionEnum)
  @IsNotEmpty()
  eventDate: ScheduleExpressionEnum;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  eventName: string;
}
