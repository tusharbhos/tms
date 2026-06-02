import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentsRepository } from './incidents.repository';
import { CreateIncidentsDto } from './dto/create-incidents.dto';
import { UpdateIncidentsDto } from './dto/update-incidents.dto';
import { FilterIncidentsDto } from './dto/filter-incidents.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly repo: IncidentsRepository) {}

  create(tenantId: number, userId: number, dto: CreateIncidentsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterIncidentsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Incidents not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateIncidentsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
