import { Module } from '@nestjs/common';
import { CustContractOdaChargesController } from './cust-contract-oda-charges.controller';
import { CustContractOdaChargesService } from './cust-contract-oda-charges.service';
import { CustContractOdaChargesRepository } from './cust-contract-oda-charges.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustContractOdaChargesController],
  providers: [CustContractOdaChargesRepository, CustContractOdaChargesService],
  exports: [CustContractOdaChargesService],
})
export class CustContractOdaChargesModule {}
