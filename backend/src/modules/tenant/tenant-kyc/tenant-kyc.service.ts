import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantKycRepository } from './tenant-kyc.repository';
import { CreateTenantKycDto } from './dto/create-tenant-kyc.dto';
import { UpdateTenantKycDto } from './dto/update-tenant-kyc.dto';
import { FilterTenantKycDto } from './dto/filter-tenant-kyc.dto';

@Injectable()
export class TenantKycService {
  constructor(private readonly repo: TenantKycRepository) {}

  create(tenantId: number, userId: number, dto: CreateTenantKycDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTenantKycDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TenantKyc not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateTenantKycDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
