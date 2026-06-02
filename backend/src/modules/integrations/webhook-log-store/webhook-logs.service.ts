import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookLogsRepository } from './webhook-logs.repository';
import { CreateWebhookLogsDto } from './dto/create-webhook-logs.dto';
import { UpdateWebhookLogsDto } from './dto/update-webhook-logs.dto';
import { FilterWebhookLogsDto } from './dto/filter-webhook-logs.dto';

@Injectable()
export class WebhookLogsService {
  constructor(private readonly repo: WebhookLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateWebhookLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterWebhookLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('WebhookLogs not found');
    return row;
  }
}
