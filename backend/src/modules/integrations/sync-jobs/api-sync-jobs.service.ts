import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiSyncJobsRepository } from './api-sync-jobs.repository';
import { CreateApiSyncJobsDto } from './dto/create-api-sync-jobs.dto';
import { UpdateApiSyncJobsDto } from './dto/update-api-sync-jobs.dto';
import { FilterApiSyncJobsDto } from './dto/filter-api-sync-jobs.dto';

@Injectable()
export class ApiSyncJobsService {
  constructor(private readonly repo: ApiSyncJobsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApiSyncJobsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApiSyncJobsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApiSyncJobs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateApiSyncJobsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
