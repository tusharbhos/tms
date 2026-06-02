import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationTemplatesRepository } from './notification-templates.repository';
import { CreateNotificationTemplatesDto } from './dto/create-notification-templates.dto';
import { UpdateNotificationTemplatesDto } from './dto/update-notification-templates.dto';
import { FilterNotificationTemplatesDto } from './dto/filter-notification-templates.dto';

@Injectable()
export class NotificationTemplatesService {
  constructor(private readonly repo: NotificationTemplatesRepository) {}

  create(tenantId: number, userId: number, dto: CreateNotificationTemplatesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterNotificationTemplatesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('NotificationTemplates not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateNotificationTemplatesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
