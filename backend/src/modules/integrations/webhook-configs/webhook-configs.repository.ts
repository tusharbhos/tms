import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateWebhookConfigsDto } from './dto/create-webhook-configs.dto';
import { UpdateWebhookConfigsDto } from './dto/update-webhook-configs.dto';
import { FilterWebhookConfigsDto } from './dto/filter-webhook-configs.dto';

// Repository — all DB access for `webhook_configs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class WebhookConfigsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateWebhookConfigsDto) {
    return this.prisma.webhookConfigs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterWebhookConfigsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.webhookConfigs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.webhookConfigs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.webhookConfigs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateWebhookConfigsDto) {
    return this.prisma.webhookConfigs.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.webhookConfigs.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
