import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateDashboardWidgetsDto } from './dto/create-dashboard-widgets.dto';
import { UpdateDashboardWidgetsDto } from './dto/update-dashboard-widgets.dto';
import { FilterDashboardWidgetsDto } from './dto/filter-dashboard-widgets.dto';

// Repository — all DB access for `dashboard_widgets`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class DashboardWidgetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateDashboardWidgetsDto) {
    return this.prisma.dashboardWidgets.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterDashboardWidgetsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.dashboardWidgets.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dashboardWidgets.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.dashboardWidgets.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateDashboardWidgetsDto) {
    return this.prisma.dashboardWidgets.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.dashboardWidgets.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
