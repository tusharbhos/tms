import { Module } from '@nestjs/common';
import { TripExpensesController } from './trip-expenses.controller';
import { TripExpensesService } from './trip-expenses.service';
import { TripExpensesRepository } from './trip-expenses.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TripExpensesController],
  providers: [TripExpensesRepository, TripExpensesService],
  exports: [TripExpensesService],
})
export class TripExpensesModule {}
