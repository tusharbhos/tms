import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentActionMasterRepository } from './incident-action-master.repository';
import { CreateIncidentActionMasterDto } from './dto/create-incident-action-master.dto';
import { UpdateIncidentActionMasterDto } from './dto/update-incident-action-master.dto';
import { FilterIncidentActionMasterDto } from './dto/filter-incident-action-master.dto';

@Injectable()
export class IncidentActionMasterService {
  constructor(private readonly repo: IncidentActionMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateIncidentActionMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterIncidentActionMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('IncidentActionMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateIncidentActionMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
