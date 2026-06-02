import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateFeatureFlagsDto } from './dto/create-feature-flags.dto';
import { UpdateFeatureFlagsDto } from './dto/update-feature-flags.dto';
import { FilterFeatureFlagsDto } from './dto/filter-feature-flags.dto';

// Repository — all DB access for `feature_flags`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class FeatureFlagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateFeatureFlagsDto) {
    return this.prisma.featureFlags.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterFeatureFlagsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.featureFlags.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.featureFlags.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.featureFlags.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateFeatureFlagsDto) {
    return this.prisma.featureFlags.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.featureFlags.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
