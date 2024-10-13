import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbService {
  private dynamoDbClient: DynamoDBClient;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({
      region: 'us-west-2', // Replace with your AWS region
    });
  }

  async queryCustomerEvents(
    customerId: string,
    eventDate: string,
    eventName: string,
  ) {
    const params: QueryCommandInput = {
      TableName: 'CustomerEvents',
      IndexName: 'OTCustomerIdEventDateIndex',
      KeyConditionExpression:
        'ot_customer_id = :customer_id and event_date > :event_date',
      FilterExpression: 'event_name = :event_name',
      ExpressionAttributeValues: {
        ':customer_id': { S: customerId },
        // Ensure event_date is passed as a string of the epoch number
        ':event_date': { N: eventDate },
        ':event_name': { S: eventName },
      },
      Select: 'COUNT',
    };

    const command = new QueryCommand(params);
    const result = await this.dynamoDbClient.send(command);

    return result.Count;
  }
}
