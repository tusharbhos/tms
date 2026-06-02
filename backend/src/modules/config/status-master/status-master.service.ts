import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusMasterRepository } from './status-master.repository';
import { CreateStatusMasterDto } from './dto/create-status-master.dto';
import { UpdateStatusMasterDto } from './dto/update-status-master.dto';
import { FilterStatusMasterDto } from './dto/filter-status-master.dto';

@Injectable()
export class StatusMasterService {
  constructor(private readonly repo: StatusMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateStatusMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterStatusMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('StatusMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateStatusMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
