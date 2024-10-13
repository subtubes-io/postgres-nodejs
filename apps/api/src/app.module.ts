import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { SchedulerModule } from './scheduler/scheduler.module';
import { PartitionsModule } from './partitions/partitions.module';

@Module({
  // imports: [SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
  imports: [PartitionsModule],
})
export class AppModule {}
