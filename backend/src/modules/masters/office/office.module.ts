import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { OfficeRepository } from './office.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OfficeController],
  providers: [OfficeRepository, OfficeService],
  exports: [OfficeService],
})
export class OfficeModule {}
