import { Module } from '@nestjs/common';
import { BookingChargesController } from './booking-charges.controller';
import { BookingChargesService } from './booking-charges.service';
import { BookingChargesRepository } from './booking-charges.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookingChargesController],
  providers: [BookingChargesRepository, BookingChargesService],
  exports: [BookingChargesService],
})
export class BookingChargesModule {}
