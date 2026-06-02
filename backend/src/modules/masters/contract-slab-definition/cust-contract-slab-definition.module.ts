import { Module } from '@nestjs/common';
import { CustContractSlabDefinitionController } from './cust-contract-slab-definition.controller';
import { CustContractSlabDefinitionService } from './cust-contract-slab-definition.service';
import { CustContractSlabDefinitionRepository } from './cust-contract-slab-definition.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustContractSlabDefinitionController],
  providers: [CustContractSlabDefinitionRepository, CustContractSlabDefinitionService],
  exports: [CustContractSlabDefinitionService],
})
export class CustContractSlabDefinitionModule {}
