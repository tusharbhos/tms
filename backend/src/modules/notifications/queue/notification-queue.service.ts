import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationQueueRepository } from './notification-queue.repository';
import { CreateNotificationQueueDto } from './dto/create-notification-queue.dto';
import { UpdateNotificationQueueDto } from './dto/update-notification-queue.dto';
import { FilterNotificationQueueDto } from './dto/filter-notification-queue.dto';

@Injectable()
export class NotificationQueueService {
  constructor(private readonly repo: NotificationQueueRepository) {}

  create(tenantId: number, userId: number, dto: CreateNotificationQueueDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterNotificationQueueDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('NotificationQueue not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateNotificationQueueDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
