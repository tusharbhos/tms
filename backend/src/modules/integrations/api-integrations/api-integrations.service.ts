import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiIntegrationsRepository } from './api-integrations.repository';
import { CreateApiIntegrationsDto } from './dto/create-api-integrations.dto';
import { UpdateApiIntegrationsDto } from './dto/update-api-integrations.dto';
import { FilterApiIntegrationsDto } from './dto/filter-api-integrations.dto';

@Injectable()
export class ApiIntegrationsService {
  constructor(private readonly repo: ApiIntegrationsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApiIntegrationsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApiIntegrationsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApiIntegrations not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateApiIntegrationsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
