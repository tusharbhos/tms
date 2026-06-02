import { Module } from '@nestjs/common';
import { IncidentDocumentsController } from './incident-documents.controller';
import { IncidentDocumentsService } from './incident-documents.service';
import { IncidentDocumentsRepository } from './incident-documents.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncidentDocumentsController],
  providers: [IncidentDocumentsRepository, IncidentDocumentsService],
  exports: [IncidentDocumentsService],
})
export class IncidentDocumentsModule {}
