import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookConfigsRepository } from './webhook-configs.repository';
import { CreateWebhookConfigsDto } from './dto/create-webhook-configs.dto';
import { UpdateWebhookConfigsDto } from './dto/update-webhook-configs.dto';
import { FilterWebhookConfigsDto } from './dto/filter-webhook-configs.dto';

@Injectable()
export class WebhookConfigsService {
  constructor(private readonly repo: WebhookConfigsRepository) {}

  create(tenantId: number, userId: number, dto: CreateWebhookConfigsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterWebhookConfigsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('WebhookConfigs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateWebhookConfigsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
