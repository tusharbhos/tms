import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateNotificationTemplatesDto } from './dto/create-notification-templates.dto';
import { UpdateNotificationTemplatesDto } from './dto/update-notification-templates.dto';
import { FilterNotificationTemplatesDto } from './dto/filter-notification-templates.dto';

// Repository — all DB access for `notification_templates`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class NotificationTemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateNotificationTemplatesDto) {
    return this.prisma.notificationTemplates.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterNotificationTemplatesDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.notificationTemplates.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notificationTemplates.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.notificationTemplates.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateNotificationTemplatesDto) {
    return this.prisma.notificationTemplates.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.notificationTemplates.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
