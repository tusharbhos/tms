import { Injectable, NotFoundException } from '@nestjs/common';
import { CustContractExcessWeightRepository } from './cust-contract-excess-weight.repository';
import { CreateCustContractExcessWeightDto } from './dto/create-cust-contract-excess-weight.dto';
import { UpdateCustContractExcessWeightDto } from './dto/update-cust-contract-excess-weight.dto';
import { FilterCustContractExcessWeightDto } from './dto/filter-cust-contract-excess-weight.dto';

@Injectable()
export class CustContractExcessWeightService {
  constructor(private readonly repo: CustContractExcessWeightRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustContractExcessWeightDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustContractExcessWeightDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustContractExcessWeight not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustContractExcessWeightDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
