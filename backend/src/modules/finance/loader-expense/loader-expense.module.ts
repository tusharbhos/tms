import { Module } from '@nestjs/common';
import { LoaderExpenseController } from './loader-expense.controller';
import { LoaderExpenseService } from './loader-expense.service';
import { LoaderExpenseRepository } from './loader-expense.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LoaderExpenseController],
  providers: [LoaderExpenseRepository, LoaderExpenseService],
  exports: [LoaderExpenseService],
})
export class LoaderExpenseModule {}
