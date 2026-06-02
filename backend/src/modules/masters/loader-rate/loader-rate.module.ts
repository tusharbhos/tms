import { Module } from '@nestjs/common';
import { LoaderRateController } from './loader-rate.controller';
import { LoaderRateService } from './loader-rate.service';
import { LoaderRateRepository } from './loader-rate.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LoaderRateController],
  providers: [LoaderRateRepository, LoaderRateService],
  exports: [LoaderRateService],
})
export class LoaderRateModule {}
