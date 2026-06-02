import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateStatusAutomationRulesDto } from './dto/create-status-automation-rules.dto';
import { UpdateStatusAutomationRulesDto } from './dto/update-status-automation-rules.dto';
import { FilterStatusAutomationRulesDto } from './dto/filter-status-automation-rules.dto';

// Repository — all DB access for `status_automation_rules`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class StatusAutomationRulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateStatusAutomationRulesDto) {
    return this.prisma.statusAutomationRules.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterStatusAutomationRulesDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.statusAutomationRules.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.statusAutomationRules.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.statusAutomationRules.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateStatusAutomationRulesDto) {
    return this.prisma.statusAutomationRules.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.statusAutomationRules.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
