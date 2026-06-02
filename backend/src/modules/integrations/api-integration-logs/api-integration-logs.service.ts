import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiIntegrationLogsRepository } from './api-integration-logs.repository';
import { CreateApiIntegrationLogsDto } from './dto/create-api-integration-logs.dto';
import { UpdateApiIntegrationLogsDto } from './dto/update-api-integration-logs.dto';
import { FilterApiIntegrationLogsDto } from './dto/filter-api-integration-logs.dto';

@Injectable()
export class ApiIntegrationLogsService {
  constructor(private readonly repo: ApiIntegrationLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApiIntegrationLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApiIntegrationLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApiIntegrationLogs not found');
    return row;
  }
}
