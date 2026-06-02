import { Module } from '@nestjs/common';
import { PrnBookingsController } from './prn-bookings.controller';
import { PrnBookingsService } from './prn-bookings.service';
import { PrnBookingsRepository } from './prn-bookings.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrnBookingsController],
  providers: [PrnBookingsRepository, PrnBookingsService],
  exports: [PrnBookingsService],
})
export class PrnBookingsModule {}
