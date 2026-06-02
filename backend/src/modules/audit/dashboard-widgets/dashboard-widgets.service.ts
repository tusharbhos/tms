import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardWidgetsRepository } from './dashboard-widgets.repository';
import { CreateDashboardWidgetsDto } from './dto/create-dashboard-widgets.dto';
import { UpdateDashboardWidgetsDto } from './dto/update-dashboard-widgets.dto';
import { FilterDashboardWidgetsDto } from './dto/filter-dashboard-widgets.dto';

@Injectable()
export class DashboardWidgetsService {
  constructor(private readonly repo: DashboardWidgetsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDashboardWidgetsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDashboardWidgetsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DashboardWidgets not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDashboardWidgetsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
