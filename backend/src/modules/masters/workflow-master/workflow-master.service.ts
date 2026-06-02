import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowMasterRepository } from './workflow-master.repository';
import { CreateWorkflowMasterDto } from './dto/create-workflow-master.dto';
import { UpdateWorkflowMasterDto } from './dto/update-workflow-master.dto';
import { FilterWorkflowMasterDto } from './dto/filter-workflow-master.dto';

@Injectable()
export class WorkflowMasterService {
  constructor(private readonly repo: WorkflowMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateWorkflowMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterWorkflowMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('WorkflowMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateWorkflowMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
