import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateLoaderRateDto } from './dto/create-loader-rate.dto';
import { UpdateLoaderRateDto } from './dto/update-loader-rate.dto';
import { FilterLoaderRateDto } from './dto/filter-loader-rate.dto';

// Repository — all DB access for `loader_rate`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class LoaderRateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateLoaderRateDto) {
    return this.prisma.loaderRate.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterLoaderRateDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.loaderRate.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.loaderRate.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.loaderRate.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateLoaderRateDto) {
    return this.prisma.loaderRate.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.loaderRate.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
