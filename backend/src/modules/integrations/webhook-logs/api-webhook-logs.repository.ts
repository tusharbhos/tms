import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateApiWebhookLogsDto } from './dto/create-api-webhook-logs.dto';
import { UpdateApiWebhookLogsDto } from './dto/update-api-webhook-logs.dto';
import { FilterApiWebhookLogsDto } from './dto/filter-api-webhook-logs.dto';

// Repository — all DB access for `txn_api_webhook_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ApiWebhookLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateApiWebhookLogsDto) {
    return this.prisma.apiWebhookLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterApiWebhookLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.apiWebhookLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiWebhookLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.apiWebhookLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_api_webhook_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
