import { Injectable, NotFoundException } from '@nestjs/common';
import { CustContractSlabDefinitionRepository } from './cust-contract-slab-definition.repository';
import { CreateCustContractSlabDefinitionDto } from './dto/create-cust-contract-slab-definition.dto';
import { UpdateCustContractSlabDefinitionDto } from './dto/update-cust-contract-slab-definition.dto';
import { FilterCustContractSlabDefinitionDto } from './dto/filter-cust-contract-slab-definition.dto';

@Injectable()
export class CustContractSlabDefinitionService {
  constructor(private readonly repo: CustContractSlabDefinitionRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustContractSlabDefinitionDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustContractSlabDefinitionDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustContractSlabDefinition not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustContractSlabDefinitionDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
