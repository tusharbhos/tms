import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTenantFeatureFlagsDto } from './dto/create-tenant-feature-flags.dto';
import { UpdateTenantFeatureFlagsDto } from './dto/update-tenant-feature-flags.dto';
import { FilterTenantFeatureFlagsDto } from './dto/filter-tenant-feature-flags.dto';

// Repository — all DB access for `tenant_feature_flags`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class TenantFeatureFlagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateTenantFeatureFlagsDto) {
    return this.prisma.tenantFeatureFlags.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterTenantFeatureFlagsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.tenantFeatureFlags.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenantFeatureFlags.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.tenantFeatureFlags.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateTenantFeatureFlagsDto) {
    return this.prisma.tenantFeatureFlags.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.tenantFeatureFlags.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
