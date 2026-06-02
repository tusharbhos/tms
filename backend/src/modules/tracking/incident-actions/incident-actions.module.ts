import { Module } from '@nestjs/common';
import { IncidentActionsController } from './incident-actions.controller';
import { IncidentActionsService } from './incident-actions.service';
import { IncidentActionsRepository } from './incident-actions.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncidentActionsController],
  providers: [IncidentActionsRepository, IncidentActionsService],
  exports: [IncidentActionsService],
})
export class IncidentActionsModule {}
