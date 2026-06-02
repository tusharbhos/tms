import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverRepository } from './driver.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DriverController],
  providers: [DriverRepository, DriverService],
  exports: [DriverService],
})
export class DriverModule {}
