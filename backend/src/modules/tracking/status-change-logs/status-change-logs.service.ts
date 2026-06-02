import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusChangeLogsRepository } from './status-change-logs.repository';
import { CreateStatusChangeLogsDto } from './dto/create-status-change-logs.dto';
import { UpdateStatusChangeLogsDto } from './dto/update-status-change-logs.dto';
import { FilterStatusChangeLogsDto } from './dto/filter-status-change-logs.dto';

@Injectable()
export class StatusChangeLogsService {
  constructor(private readonly repo: StatusChangeLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateStatusChangeLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterStatusChangeLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('StatusChangeLogs not found');
    return row;
  }
}
