import { Module } from '@nestjs/common';
import { WorkflowMasterController } from './workflow-master.controller';
import { WorkflowMasterService } from './workflow-master.service';
import { WorkflowMasterRepository } from './workflow-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkflowMasterController],
  providers: [WorkflowMasterRepository, WorkflowMasterService],
  exports: [WorkflowMasterService],
})
export class WorkflowMasterModule {}
