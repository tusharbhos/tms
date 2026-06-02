import { Module } from '@nestjs/common';
import { IncidentTypeMasterController } from './incident-type-master.controller';
import { IncidentTypeMasterService } from './incident-type-master.service';
import { IncidentTypeMasterRepository } from './incident-type-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncidentTypeMasterController],
  providers: [IncidentTypeMasterRepository, IncidentTypeMasterService],
  exports: [IncidentTypeMasterService],
})
export class IncidentTypeMasterModule {}
