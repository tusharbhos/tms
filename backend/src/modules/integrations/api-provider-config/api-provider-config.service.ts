import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiProviderConfigRepository } from './api-provider-config.repository';
import { CreateApiProviderConfigDto } from './dto/create-api-provider-config.dto';
import { UpdateApiProviderConfigDto } from './dto/update-api-provider-config.dto';
import { FilterApiProviderConfigDto } from './dto/filter-api-provider-config.dto';

@Injectable()
export class ApiProviderConfigService {
  constructor(private readonly repo: ApiProviderConfigRepository) {}

  create(tenantId: number, userId: number, dto: CreateApiProviderConfigDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApiProviderConfigDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApiProviderConfig not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateApiProviderConfigDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
