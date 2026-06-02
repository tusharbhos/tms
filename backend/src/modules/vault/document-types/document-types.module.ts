import { Module } from '@nestjs/common';
import { DocumentTypesController } from './document-types.controller';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesRepository } from './document-types.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesRepository, DocumentTypesService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
