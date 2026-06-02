import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduledJobsRepository } from './scheduled-jobs.repository';
import { CreateScheduledJobsDto } from './dto/create-scheduled-jobs.dto';
import { UpdateScheduledJobsDto } from './dto/update-scheduled-jobs.dto';
import { FilterScheduledJobsDto } from './dto/filter-scheduled-jobs.dto';

@Injectable()
export class ScheduledJobsService {
  constructor(private readonly repo: ScheduledJobsRepository) {}

  create(tenantId: number, userId: number, dto: CreateScheduledJobsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterScheduledJobsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ScheduledJobs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateScheduledJobsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
