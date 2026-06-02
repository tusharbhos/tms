import { Module } from '@nestjs/common';
import { ApprovalActionLogsController } from './approval-action-logs.controller';
import { ApprovalActionLogsService } from './approval-action-logs.service';
import { ApprovalActionLogsRepository } from './approval-action-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApprovalActionLogsController],
  providers: [ApprovalActionLogsRepository, ApprovalActionLogsService],
  exports: [ApprovalActionLogsService],
})
export class ApprovalActionLogsModule {}
