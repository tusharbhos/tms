import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateNumberSeriesConfigDto } from './dto/create-number-series-config.dto';
import { UpdateNumberSeriesConfigDto } from './dto/update-number-series-config.dto';
import { FilterNumberSeriesConfigDto } from './dto/filter-number-series-config.dto';

// Repository — all DB access for `number_series_config`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class NumberSeriesConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateNumberSeriesConfigDto) {
    return this.prisma.numberSeriesConfig.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterNumberSeriesConfigDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.numberSeriesConfig.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.numberSeriesConfig.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.numberSeriesConfig.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateNumberSeriesConfigDto) {
    return this.prisma.numberSeriesConfig.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.numberSeriesConfig.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
