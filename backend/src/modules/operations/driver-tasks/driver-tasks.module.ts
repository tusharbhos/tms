import { Module } from '@nestjs/common';
import { DriverTasksController } from './driver-tasks.controller';
import { DriverTasksService } from './driver-tasks.service';
import { DriverTasksRepository } from './driver-tasks.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DriverTasksController],
  providers: [DriverTasksRepository, DriverTasksService],
  exports: [DriverTasksService],
})
export class DriverTasksModule {}
