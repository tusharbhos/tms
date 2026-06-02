import { Injectable, NotFoundException } from '@nestjs/common';
import { CustContractSlabRatesRepository } from './cust-contract-slab-rates.repository';
import { CreateCustContractSlabRatesDto } from './dto/create-cust-contract-slab-rates.dto';
import { UpdateCustContractSlabRatesDto } from './dto/update-cust-contract-slab-rates.dto';
import { FilterCustContractSlabRatesDto } from './dto/filter-cust-contract-slab-rates.dto';

@Injectable()
export class CustContractSlabRatesService {
  constructor(private readonly repo: CustContractSlabRatesRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustContractSlabRatesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustContractSlabRatesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustContractSlabRates not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustContractSlabRatesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
