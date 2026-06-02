import { Injectable, NotFoundException } from '@nestjs/common';
import { CpKycRepository } from './cp-kyc.repository';
import { CreateCpKycDto } from './dto/create-cp-kyc.dto';
import { UpdateCpKycDto } from './dto/update-cp-kyc.dto';
import { FilterCpKycDto } from './dto/filter-cp-kyc.dto';

@Injectable()
export class CpKycService {
  constructor(private readonly repo: CpKycRepository) {}

  create(tenantId: number, userId: number, dto: CreateCpKycDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCpKycDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CpKyc not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCpKycDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
