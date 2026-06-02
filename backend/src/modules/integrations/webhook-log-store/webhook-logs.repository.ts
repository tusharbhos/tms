import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateWebhookLogsDto } from './dto/create-webhook-logs.dto';
import { UpdateWebhookLogsDto } from './dto/update-webhook-logs.dto';
import { FilterWebhookLogsDto } from './dto/filter-webhook-logs.dto';

// Repository — all DB access for `webhook_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class WebhookLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateWebhookLogsDto) {
    return this.prisma.webhookLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterWebhookLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.webhookLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.webhookLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.webhookLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // webhook_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
