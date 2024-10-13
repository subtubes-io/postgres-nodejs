import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { DynamoDbService } from './dynamodb.service';
import { EventBridgeService } from './eventbridge.service';
import { SeedEventDto } from './dto/create-seed-event.dto';
import { DynamoDBSeederService } from './dynamodbseeder.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly dynamoDbService: DynamoDbService,
    private readonly eventBridgeService: EventBridgeService,
    private readonly dynamoDBSeederService: DynamoDBSeederService,
  ) {}

  @Get('customer-events-count')
  async getCustomerEventsCount(
    @Query('customerId') customerId: string,
    @Query('eventDate') eventDate: string,
    @Query('eventName') eventName: string,
  ) {
    const count = await this.dynamoDbService.queryCustomerEvents(
      customerId,
      eventDate,
      eventName,
    );
    return { count };
  }

  @Post()
  async createEventBridgeRule(@Body() createEventDto: CreateEventDto) {
    const count =
      await this.eventBridgeService.createEventBridgeRule(createEventDto);
    return { count };
  }

  @Post('seed')
  async seedDynamoDB(@Body() seedEventDto: SeedEventDto) {
    await this.dynamoDBSeederService.seedData(seedEventDto);
    return 'Seeding complete!';
  }
}
