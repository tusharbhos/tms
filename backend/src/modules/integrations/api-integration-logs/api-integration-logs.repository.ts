import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateApiIntegrationLogsDto } from './dto/create-api-integration-logs.dto';
import { UpdateApiIntegrationLogsDto } from './dto/update-api-integration-logs.dto';
import { FilterApiIntegrationLogsDto } from './dto/filter-api-integration-logs.dto';

// Repository — all DB access for `api_integration_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ApiIntegrationLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateApiIntegrationLogsDto) {
    return this.prisma.apiIntegrationLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterApiIntegrationLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.apiIntegrationLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiIntegrationLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.apiIntegrationLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // api_integration_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
