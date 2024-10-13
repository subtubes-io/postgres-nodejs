import { Injectable } from '@nestjs/common';
import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { CreateEventDto } from './dto/create-event.dto';
import * as moment from 'moment-timezone';

const STEP_FUNCTION_ARN =
  'arn:aws:states:us-west-2:568949616117:stateMachine:DynamoDBQueryStateMachine';
const EVENT_BRIDGE_ROLE_ARN =
  'arn:aws:iam::568949616117:role/eventbridge_invoke_step_function_role';

@Injectable()
export class EventBridgeService {
  private eventBridgeClient: EventBridgeClient;

  constructor() {
    this.eventBridgeClient = new EventBridgeClient({ region: 'us-west-2' });
  }

  private generateCronExpression(minutesFromNow: number): string {
    const time = moment.utc().add(minutesFromNow, 'minutes');
    const minute = time.minute();
    const hour = time.hour();
    const day = time.date();
    const month = time.month() + 1; // month() returns 0-11, so we add 1
    const year = time.year();
    return `cron(${minute} ${hour} ${day} ${month} ? ${year})`;
  }

  async createEventBridgeRule(createEventDto: CreateEventDto) {
    const randomNum = getRandomIntMax(100);
    const ruleName = `test-rule-${randomNum}`;

    const ScheduleExpressions = {
      In1Minute: this.generateCronExpression(1),
      In2Minutes: this.generateCronExpression(2),
      In5Minutes: this.generateCronExpression(5),
      In1Hour: this.generateCronExpression(60),
      In2Hours: this.generateCronExpression(120),
      In3Hours: this.generateCronExpression(180),
      In4Hours: this.generateCronExpression(240),
      In5Hours: this.generateCronExpression(300),
    };

    const ruleCommand = new PutRuleCommand({
      Name: ruleName,
      ScheduleExpression: ScheduleExpressions[createEventDto.eventDate],
    });

    // need to pass this from the frontend
    const numHoursPast = 6;
    const sixHoursAgo = Date.now() - numHoursPast * 60 * 60 * 1000;
    const epochTime = Math.floor(sixHoursAgo / 1000);

    // const ruleResponse =
    await this.eventBridgeClient.send(ruleCommand);

    const input = JSON.stringify({
      customerId: createEventDto.customerId,
      eventName: createEventDto.eventName,
      eventDate: epochTime, //createEventDto.eventDate,
    });

    const targetCommand = new PutTargetsCommand({
      Rule: ruleName,
      Targets: [
        {
          Id: 'StepFunctionTarget',
          Arn: STEP_FUNCTION_ARN,
          RoleArn: EVENT_BRIDGE_ROLE_ARN,
          Input: input,
        },
      ],
    });

    await this.eventBridgeClient.send(targetCommand);

    return {
      message: `EventBridge rule ${ruleName} created successfully!`,
    };
  }
}

function getRandomIntMax(max) {
  return Math.floor(Math.random() * max);
}
