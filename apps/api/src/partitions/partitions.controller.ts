import { Controller, Get } from '@nestjs/common';
import { PartitionsService } from './partitions.service';

@Controller('partitions')
export class PartitionsController {
  constructor(private readonly partitionsService: PartitionsService) {}

  // Define a GET endpoint to trigger the query
  @Get()
  async getPartitionData() {
    try {
      // Call the service to run the raw SQL query
      const data = await this.partitionsService.getPartitions();
      return data; // Return the result as the response
    } catch (error) {
      throw new Error(`Error fetching partition data: ${error.message}`);
    }
  }

  @Get('/indexes')
  async getIndexesData() {
    try {
      // Call the service to run the raw SQL query
      const data = await this.partitionsService.getIndexes();
      return data; // Return the result as the response
    } catch (error) {
      throw new Error(`Error fetching partition data: ${error.message}`);
    }
  }
}
