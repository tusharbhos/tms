import { Module } from '@nestjs/common';
import { ApiIntegrationLogsController } from './api-integration-logs.controller';
import { ApiIntegrationLogsService } from './api-integration-logs.service';
import { ApiIntegrationLogsRepository } from './api-integration-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiIntegrationLogsController],
  providers: [ApiIntegrationLogsRepository, ApiIntegrationLogsService],
  exports: [ApiIntegrationLogsService],
})
export class ApiIntegrationLogsModule {}
