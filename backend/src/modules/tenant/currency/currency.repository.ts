import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { FilterCurrencyDto } from './dto/filter-currency.dto';

// Repository — all DB access for `currency`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class CurrencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateCurrencyDto) {
    return this.prisma.currency.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterCurrencyDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.currency.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.currency.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.currency.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateCurrencyDto) {
    return this.prisma.currency.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.currency.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
