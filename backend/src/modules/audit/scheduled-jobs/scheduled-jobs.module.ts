import { Module } from '@nestjs/common';
import { ScheduledJobsController } from './scheduled-jobs.controller';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { ScheduledJobsRepository } from './scheduled-jobs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ScheduledJobsController],
  providers: [ScheduledJobsRepository, ScheduledJobsService],
  exports: [ScheduledJobsService],
})
export class ScheduledJobsModule {}
