import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStepsRepository } from './approval-steps.repository';
import { CreateApprovalStepsDto } from './dto/create-approval-steps.dto';
import { UpdateApprovalStepsDto } from './dto/update-approval-steps.dto';
import { FilterApprovalStepsDto } from './dto/filter-approval-steps.dto';

@Injectable()
export class ApprovalStepsService {
  constructor(private readonly repo: ApprovalStepsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApprovalStepsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApprovalStepsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApprovalSteps not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateApprovalStepsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
