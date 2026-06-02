import { Module } from '@nestjs/common';
import { IncidentActionMasterController } from './incident-action-master.controller';
import { IncidentActionMasterService } from './incident-action-master.service';
import { IncidentActionMasterRepository } from './incident-action-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncidentActionMasterController],
  providers: [IncidentActionMasterRepository, IncidentActionMasterService],
  exports: [IncidentActionMasterService],
})
export class IncidentActionMasterModule {}
