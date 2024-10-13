import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { faker } from '@faker-js/faker';
import { SeedEventDto } from './dto/create-seed-event.dto';

@Injectable()
export class DynamoDBSeederService {
  private readonly logger = new Logger(DynamoDBSeederService.name);
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly tableName = 'CustomerEvents';

  constructor() {
    this.ddbClient = new DynamoDBClient({ region: 'us-west-2' });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  private generateFakeEvent(customerId: string, eventName: string) {
    const currentTime = Math.floor(Date.now() / 1000); // current time in epoch seconds
    const hoursAgo = currentTime - 1 * 3600; // epoch time for 1 hours ago

    return {
      id: faker.string.uuid(),
      ot_customer_id: customerId,
      event_name: eventName,
      event_date: faker.number.int({ min: hoursAgo, max: currentTime }),
      expiration_time: faker.number.int({
        min: currentTime,
        max: currentTime + 3600 * 24 * 7,
      }), // expires in up to 7 days
    };
  }

  async seedData(seedEventDto: SeedEventDto) {
    const { customerId, eventName, seedCount } = seedEventDto;
    console.log(customerId);
    const putRequests = [];

    for (let i = 0; i < seedCount; i++) {
      const fakeEvent = this.generateFakeEvent(customerId, eventName);

      const putRequest = new PutCommand({
        TableName: this.tableName,
        Item: fakeEvent,
      });

      putRequests.push(this.ddbDocClient.send(putRequest));
    }

    try {
      await Promise.all(putRequests);
      this.logger.log(
        `${seedCount} items successfully added to DynamoDB table.`,
      );
    } catch (error) {
      this.logger.error('Error adding items to DynamoDB:', error);
    }
  }
}
