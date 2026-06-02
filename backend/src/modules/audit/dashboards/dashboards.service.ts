import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardsRepository } from './dashboards.repository';
import { CreateDashboardsDto } from './dto/create-dashboards.dto';
import { UpdateDashboardsDto } from './dto/update-dashboards.dto';
import { FilterDashboardsDto } from './dto/filter-dashboards.dto';

@Injectable()
export class DashboardsService {
  constructor(private readonly repo: DashboardsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDashboardsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDashboardsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Dashboards not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDashboardsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
