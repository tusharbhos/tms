import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CurrencyController],
  providers: [CurrencyRepository, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
