import { Module } from '@nestjs/common';
import { PrintTemplatesController } from './print-templates.controller';
import { PrintTemplatesService } from './print-templates.service';
import { PrintTemplatesRepository } from './print-templates.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrintTemplatesController],
  providers: [PrintTemplatesRepository, PrintTemplatesService],
  exports: [PrintTemplatesService],
})
export class PrintTemplatesModule {}
