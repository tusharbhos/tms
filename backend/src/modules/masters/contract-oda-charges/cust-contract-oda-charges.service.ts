import { Injectable, NotFoundException } from '@nestjs/common';
import { CustContractOdaChargesRepository } from './cust-contract-oda-charges.repository';
import { CreateCustContractOdaChargesDto } from './dto/create-cust-contract-oda-charges.dto';
import { UpdateCustContractOdaChargesDto } from './dto/update-cust-contract-oda-charges.dto';
import { FilterCustContractOdaChargesDto } from './dto/filter-cust-contract-oda-charges.dto';

@Injectable()
export class CustContractOdaChargesService {
  constructor(private readonly repo: CustContractOdaChargesRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustContractOdaChargesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustContractOdaChargesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustContractOdaCharges not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustContractOdaChargesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
