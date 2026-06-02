import { Injectable, NotFoundException } from '@nestjs/common';
import { ReasonMasterRepository } from './reason-master.repository';
import { CreateReasonMasterDto } from './dto/create-reason-master.dto';
import { UpdateReasonMasterDto } from './dto/update-reason-master.dto';
import { FilterReasonMasterDto } from './dto/filter-reason-master.dto';

@Injectable()
export class ReasonMasterService {
  constructor(private readonly repo: ReasonMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateReasonMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterReasonMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ReasonMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateReasonMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
