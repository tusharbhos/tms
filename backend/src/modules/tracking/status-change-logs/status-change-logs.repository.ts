import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateStatusChangeLogsDto } from './dto/create-status-change-logs.dto';
import { UpdateStatusChangeLogsDto } from './dto/update-status-change-logs.dto';
import { FilterStatusChangeLogsDto } from './dto/filter-status-change-logs.dto';

// Repository — all DB access for `txn_status_change_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class StatusChangeLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateStatusChangeLogsDto) {
    return this.prisma.statusChangeLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterStatusChangeLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.statusChangeLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.statusChangeLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.statusChangeLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_status_change_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
