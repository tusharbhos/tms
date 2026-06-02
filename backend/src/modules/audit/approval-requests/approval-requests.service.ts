import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalRequestsRepository } from './approval-requests.repository';
import { CreateApprovalRequestsDto } from './dto/create-approval-requests.dto';
import { UpdateApprovalRequestsDto } from './dto/update-approval-requests.dto';
import { FilterApprovalRequestsDto } from './dto/filter-approval-requests.dto';

@Injectable()
export class ApprovalRequestsService {
  constructor(private readonly repo: ApprovalRequestsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApprovalRequestsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApprovalRequestsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApprovalRequests not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateApprovalRequestsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
