import { Module } from '@nestjs/common';
import { StationCoverageController } from './station-coverage.controller';
import { StationCoverageService } from './station-coverage.service';
import { StationCoverageRepository } from './station-coverage.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StationCoverageController],
  providers: [StationCoverageRepository, StationCoverageService],
  exports: [StationCoverageService],
})
export class StationCoverageModule {}
