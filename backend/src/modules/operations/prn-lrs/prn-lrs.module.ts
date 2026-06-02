import { Module } from '@nestjs/common';
import { PrnLrsController } from './prn-lrs.controller';
import { PrnLrsService } from './prn-lrs.service';
import { PrnLrsRepository } from './prn-lrs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrnLrsController],
  providers: [PrnLrsRepository, PrnLrsService],
  exports: [PrnLrsService],
})
export class PrnLrsModule {}
