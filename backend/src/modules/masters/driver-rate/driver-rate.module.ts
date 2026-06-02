import { Module } from '@nestjs/common';
import { DriverRateController } from './driver-rate.controller';
import { DriverRateService } from './driver-rate.service';
import { DriverRateRepository } from './driver-rate.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DriverRateController],
  providers: [DriverRateRepository, DriverRateService],
  exports: [DriverRateService],
})
export class DriverRateModule {}
