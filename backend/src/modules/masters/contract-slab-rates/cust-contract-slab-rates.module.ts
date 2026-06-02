import { Module } from '@nestjs/common';
import { CustContractSlabRatesController } from './cust-contract-slab-rates.controller';
import { CustContractSlabRatesService } from './cust-contract-slab-rates.service';
import { CustContractSlabRatesRepository } from './cust-contract-slab-rates.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustContractSlabRatesController],
  providers: [CustContractSlabRatesRepository, CustContractSlabRatesService],
  exports: [CustContractSlabRatesService],
})
export class CustContractSlabRatesModule {}
