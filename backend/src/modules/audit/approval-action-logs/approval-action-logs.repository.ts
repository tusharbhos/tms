import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateApprovalActionLogsDto } from './dto/create-approval-action-logs.dto';
import { UpdateApprovalActionLogsDto } from './dto/update-approval-action-logs.dto';
import { FilterApprovalActionLogsDto } from './dto/filter-approval-action-logs.dto';

// Repository — all DB access for `approval_action_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ApprovalActionLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateApprovalActionLogsDto) {
    return this.prisma.approvalActionLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterApprovalActionLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.approvalActionLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.approvalActionLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.approvalActionLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // approval_action_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
