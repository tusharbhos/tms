import { Module } from '@nestjs/common';
import { NumberSeriesConfigController } from './number-series-config.controller';
import { NumberSeriesConfigService } from './number-series-config.service';
import { NumberSeriesConfigRepository } from './number-series-config.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NumberSeriesConfigController],
  providers: [NumberSeriesConfigRepository, NumberSeriesConfigService],
  exports: [NumberSeriesConfigService],
})
export class NumberSeriesConfigModule {}
