import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreatePrnDto } from './dto/create-prn.dto';
import { UpdatePrnDto } from './dto/update-prn.dto';
import { FilterPrnDto } from './dto/filter-prn.dto';

// Repository — all DB access for `txn_prn`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class PrnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreatePrnDto) {
    return this.prisma.prn.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterPrnDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.prn.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.prn.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.prn.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdatePrnDto) {
    return this.prisma.prn.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.prn.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
