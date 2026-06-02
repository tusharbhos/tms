import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentActionsRepository } from './incident-actions.repository';
import { CreateIncidentActionsDto } from './dto/create-incident-actions.dto';
import { UpdateIncidentActionsDto } from './dto/update-incident-actions.dto';
import { FilterIncidentActionsDto } from './dto/filter-incident-actions.dto';

@Injectable()
export class IncidentActionsService {
  constructor(private readonly repo: IncidentActionsRepository) {}

  create(tenantId: number, userId: number, dto: CreateIncidentActionsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterIncidentActionsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('IncidentActions not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateIncidentActionsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
