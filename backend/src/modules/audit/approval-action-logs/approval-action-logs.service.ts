import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalActionLogsRepository } from './approval-action-logs.repository';
import { CreateApprovalActionLogsDto } from './dto/create-approval-action-logs.dto';
import { UpdateApprovalActionLogsDto } from './dto/update-approval-action-logs.dto';
import { FilterApprovalActionLogsDto } from './dto/filter-approval-action-logs.dto';

@Injectable()
export class ApprovalActionLogsService {
  constructor(private readonly repo: ApprovalActionLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApprovalActionLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApprovalActionLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApprovalActionLogs not found');
    return row;
  }
}
