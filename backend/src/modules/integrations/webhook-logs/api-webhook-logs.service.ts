import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiWebhookLogsRepository } from './api-webhook-logs.repository';
import { CreateApiWebhookLogsDto } from './dto/create-api-webhook-logs.dto';
import { UpdateApiWebhookLogsDto } from './dto/update-api-webhook-logs.dto';
import { FilterApiWebhookLogsDto } from './dto/filter-api-webhook-logs.dto';

@Injectable()
export class ApiWebhookLogsService {
  constructor(private readonly repo: ApiWebhookLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateApiWebhookLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterApiWebhookLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ApiWebhookLogs not found');
    return row;
  }
}
