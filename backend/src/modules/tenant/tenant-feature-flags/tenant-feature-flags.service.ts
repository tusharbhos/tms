import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantFeatureFlagsRepository } from './tenant-feature-flags.repository';
import { CreateTenantFeatureFlagsDto } from './dto/create-tenant-feature-flags.dto';
import { UpdateTenantFeatureFlagsDto } from './dto/update-tenant-feature-flags.dto';
import { FilterTenantFeatureFlagsDto } from './dto/filter-tenant-feature-flags.dto';

@Injectable()
export class TenantFeatureFlagsService {
  constructor(private readonly repo: TenantFeatureFlagsRepository) {}

  create(tenantId: number, userId: number, dto: CreateTenantFeatureFlagsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTenantFeatureFlagsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TenantFeatureFlags not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateTenantFeatureFlagsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
