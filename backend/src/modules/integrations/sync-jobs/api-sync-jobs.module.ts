import { Module } from '@nestjs/common';
import { ApiSyncJobsController } from './api-sync-jobs.controller';
import { ApiSyncJobsService } from './api-sync-jobs.service';
import { ApiSyncJobsRepository } from './api-sync-jobs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiSyncJobsController],
  providers: [ApiSyncJobsRepository, ApiSyncJobsService],
  exports: [ApiSyncJobsService],
})
export class ApiSyncJobsModule {}
