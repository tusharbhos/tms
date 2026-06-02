import { Module } from '@nestjs/common';
import { VehicleLocationLogsController } from './vehicle-location-logs.controller';
import { VehicleLocationLogsService } from './vehicle-location-logs.service';
import { VehicleLocationLogsRepository } from './vehicle-location-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VehicleLocationLogsController],
  providers: [VehicleLocationLogsRepository, VehicleLocationLogsService],
  exports: [VehicleLocationLogsService],
})
export class VehicleLocationLogsModule {}
