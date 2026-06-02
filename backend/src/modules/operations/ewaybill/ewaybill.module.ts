import { Module } from '@nestjs/common';
import { EwaybillController } from './ewaybill.controller';
import { EwaybillService } from './ewaybill.service';
import { EwaybillRepository } from './ewaybill.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EwaybillController],
  providers: [EwaybillRepository, EwaybillService],
  exports: [EwaybillService],
})
export class EwaybillModule {}
