import { Module } from '@nestjs/common';
import { ApprovalStepsController } from './approval-steps.controller';
import { ApprovalStepsService } from './approval-steps.service';
import { ApprovalStepsRepository } from './approval-steps.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApprovalStepsController],
  providers: [ApprovalStepsRepository, ApprovalStepsService],
  exports: [ApprovalStepsService],
})
export class ApprovalStepsModule {}
