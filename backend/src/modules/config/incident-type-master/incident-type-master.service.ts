import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentTypeMasterRepository } from './incident-type-master.repository';
import { CreateIncidentTypeMasterDto } from './dto/create-incident-type-master.dto';
import { UpdateIncidentTypeMasterDto } from './dto/update-incident-type-master.dto';
import { FilterIncidentTypeMasterDto } from './dto/filter-incident-type-master.dto';

@Injectable()
export class IncidentTypeMasterService {
  constructor(private readonly repo: IncidentTypeMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateIncidentTypeMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterIncidentTypeMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('IncidentTypeMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateIncidentTypeMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
