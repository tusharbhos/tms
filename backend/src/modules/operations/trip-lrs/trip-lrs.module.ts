import { Module } from '@nestjs/common';
import { TripLrsController } from './trip-lrs.controller';
import { TripLrsService } from './trip-lrs.service';
import { TripLrsRepository } from './trip-lrs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TripLrsController],
  providers: [TripLrsRepository, TripLrsService],
  exports: [TripLrsService],
})
export class TripLrsModule {}
