import { Module } from '@nestjs/common';
import { CustContractController } from './cust-contract.controller';
import { CustContractService } from './cust-contract.service';
import { CustContractRepository } from './cust-contract.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustContractController],
  providers: [CustContractRepository, CustContractService],
  exports: [CustContractService],
})
export class CustContractModule {}
