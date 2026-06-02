import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateActivityLogsDto } from './dto/create-activity-logs.dto';
import { UpdateActivityLogsDto } from './dto/update-activity-logs.dto';
import { FilterActivityLogsDto } from './dto/filter-activity-logs.dto';

// Repository — all DB access for `activity_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ActivityLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateActivityLogsDto) {
    return this.prisma.activityLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterActivityLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.activityLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.activityLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // activity_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
