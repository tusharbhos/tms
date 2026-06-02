import { Module } from '@nestjs/common';
import { CustContractExcessWeightController } from './cust-contract-excess-weight.controller';
import { CustContractExcessWeightService } from './cust-contract-excess-weight.service';
import { CustContractExcessWeightRepository } from './cust-contract-excess-weight.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustContractExcessWeightController],
  providers: [CustContractExcessWeightRepository, CustContractExcessWeightService],
  exports: [CustContractExcessWeightService],
})
export class CustContractExcessWeightModule {}
