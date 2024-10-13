import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { DynamoDbService } from './dynamodb.service';
import { EventBridgeService } from './eventbridge.service';
import { DynamoDBSeederService } from './dynamodbseeder.service';

@Module({
  controllers: [SchedulerController],
  providers: [
    SchedulerService,
    DynamoDbService,
    EventBridgeService,
    DynamoDBSeederService,
  ],
})
export class SchedulerModule {}
