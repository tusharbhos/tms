import { Module } from '@nestjs/common';
import { BookingItemsController } from './booking-items.controller';
import { BookingItemsService } from './booking-items.service';
import { BookingItemsRepository } from './booking-items.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookingItemsController],
  providers: [BookingItemsRepository, BookingItemsService],
  exports: [BookingItemsService],
})
export class BookingItemsModule {}
