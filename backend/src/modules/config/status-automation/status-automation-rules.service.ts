import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusAutomationRulesRepository } from './status-automation-rules.repository';
import { CreateStatusAutomationRulesDto } from './dto/create-status-automation-rules.dto';
import { UpdateStatusAutomationRulesDto } from './dto/update-status-automation-rules.dto';
import { FilterStatusAutomationRulesDto } from './dto/filter-status-automation-rules.dto';

@Injectable()
export class StatusAutomationRulesService {
  constructor(private readonly repo: StatusAutomationRulesRepository) {}

  create(tenantId: number, userId: number, dto: CreateStatusAutomationRulesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterStatusAutomationRulesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('StatusAutomationRules not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateStatusAutomationRulesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
