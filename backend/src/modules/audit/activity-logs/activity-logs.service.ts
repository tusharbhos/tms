import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityLogsRepository } from './activity-logs.repository';
import { CreateActivityLogsDto } from './dto/create-activity-logs.dto';
import { UpdateActivityLogsDto } from './dto/update-activity-logs.dto';
import { FilterActivityLogsDto } from './dto/filter-activity-logs.dto';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly repo: ActivityLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateActivityLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterActivityLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ActivityLogs not found');
    return row;
  }
}
