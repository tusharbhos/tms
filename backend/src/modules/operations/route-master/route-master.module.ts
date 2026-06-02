import { Module } from '@nestjs/common';
import { RouteMasterController } from './route-master.controller';
import { RouteMasterService } from './route-master.service';
import { RouteMasterRepository } from './route-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteMasterController],
  providers: [RouteMasterRepository, RouteMasterService],
  exports: [RouteMasterService],
})
export class RouteMasterModule {}
