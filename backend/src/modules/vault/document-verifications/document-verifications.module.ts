import { Module } from '@nestjs/common';
import { DocumentVerificationsController } from './document-verifications.controller';
import { DocumentVerificationsService } from './document-verifications.service';
import { DocumentVerificationsRepository } from './document-verifications.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentVerificationsController],
  providers: [DocumentVerificationsRepository, DocumentVerificationsService],
  exports: [DocumentVerificationsService],
})
export class DocumentVerificationsModule {}
