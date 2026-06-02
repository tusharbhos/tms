import { Module } from '@nestjs/common';
import { GeoHierarchyController } from './geo-hierarchy.controller';
import { GeoHierarchyService } from './geo-hierarchy.service';
import { GeoHierarchyRepository } from './geo-hierarchy.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GeoHierarchyController],
  providers: [GeoHierarchyRepository, GeoHierarchyService],
  exports: [GeoHierarchyService],
})
export class GeoHierarchyModule {}
