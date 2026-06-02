import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateScheduledJobsDto } from './dto/create-scheduled-jobs.dto';
import { UpdateScheduledJobsDto } from './dto/update-scheduled-jobs.dto';
import { FilterScheduledJobsDto } from './dto/filter-scheduled-jobs.dto';

// Repository — all DB access for `scheduled_jobs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ScheduledJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateScheduledJobsDto) {
    return this.prisma.scheduledJobs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterScheduledJobsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.scheduledJobs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.scheduledJobs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.scheduledJobs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateScheduledJobsDto) {
    return this.prisma.scheduledJobs.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.scheduledJobs.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
