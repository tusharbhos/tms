import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateLoaderExpenseDto } from './dto/create-loader-expense.dto';
import { UpdateLoaderExpenseDto } from './dto/update-loader-expense.dto';
import { FilterLoaderExpenseDto } from './dto/filter-loader-expense.dto';

// Repository — all DB access for `fm_loader_expense`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class LoaderExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateLoaderExpenseDto) {
    return this.prisma.loaderExpense.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterLoaderExpenseDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.loaderExpense.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.loaderExpense.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.loaderExpense.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateLoaderExpenseDto) {
    return this.prisma.loaderExpense.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.loaderExpense.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
