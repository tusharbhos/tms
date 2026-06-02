import { Module } from '@nestjs/common';
import { FuelLogController } from './fuel-log.controller';
import { FuelLogService } from './fuel-log.service';
import { FuelLogRepository } from './fuel-log.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FuelLogController],
  providers: [FuelLogRepository, FuelLogService],
  exports: [FuelLogService],
})
export class FuelLogModule {}
