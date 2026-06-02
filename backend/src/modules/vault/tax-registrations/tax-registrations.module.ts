import { Module } from '@nestjs/common';
import { TaxRegistrationsController } from './tax-registrations.controller';
import { TaxRegistrationsService } from './tax-registrations.service';
import { TaxRegistrationsRepository } from './tax-registrations.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TaxRegistrationsController],
  providers: [TaxRegistrationsRepository, TaxRegistrationsService],
  exports: [TaxRegistrationsService],
})
export class TaxRegistrationsModule {}
