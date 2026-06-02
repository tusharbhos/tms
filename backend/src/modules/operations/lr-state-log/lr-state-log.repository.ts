import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateLrStateLogDto } from './dto/create-lr-state-log.dto';
import { UpdateLrStateLogDto } from './dto/update-lr-state-log.dto';
import { FilterLrStateLogDto } from './dto/filter-lr-state-log.dto';

// Repository — all DB access for `txn_lr_state_log`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class LrStateLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateLrStateLogDto) {
    return this.prisma.lrStateLog.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterLrStateLogDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.lrStateLog.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lrStateLog.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.lrStateLog.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_lr_state_log is an IMMUTABLE LOG — no update/delete permitted by design.
}
