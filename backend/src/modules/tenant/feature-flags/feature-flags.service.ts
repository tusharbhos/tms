import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureFlagsRepository } from './feature-flags.repository';
import { CreateFeatureFlagsDto } from './dto/create-feature-flags.dto';
import { UpdateFeatureFlagsDto } from './dto/update-feature-flags.dto';
import { FilterFeatureFlagsDto } from './dto/filter-feature-flags.dto';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly repo: FeatureFlagsRepository) {}

  create(tenantId: number, userId: number, dto: CreateFeatureFlagsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterFeatureFlagsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('FeatureFlags not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateFeatureFlagsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
