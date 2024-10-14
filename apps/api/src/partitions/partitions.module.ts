import { Module } from '@nestjs/common';
import { PartitionsService } from './partitions.service';
import { PartitionsController } from './partitions.controller';

@Module({
  providers: [PartitionsService],
  controllers: [PartitionsController],
  // exports: ['DRIZZLE_CONNECTION'], // Export the connection so it can be used elsewhere
})
export class PartitionsModule {}
