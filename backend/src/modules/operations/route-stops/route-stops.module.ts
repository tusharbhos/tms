import { Module } from '@nestjs/common';
import { RouteStopsController } from './route-stops.controller';
import { RouteStopsService } from './route-stops.service';
import { RouteStopsRepository } from './route-stops.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteStopsController],
  providers: [RouteStopsRepository, RouteStopsService],
  exports: [RouteStopsService],
})
export class RouteStopsModule {}
