import { Injectable, NotFoundException } from '@nestjs/common';
import { CustContractRepository } from './cust-contract.repository';
import { CreateCustContractDto } from './dto/create-cust-contract.dto';
import { UpdateCustContractDto } from './dto/update-cust-contract.dto';
import { FilterCustContractDto } from './dto/filter-cust-contract.dto';

@Injectable()
export class CustContractService {
  constructor(private readonly repo: CustContractRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustContractDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustContractDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustContract not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustContractDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
