import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreatePrnLrsDto } from './dto/create-prn-lrs.dto';
import { UpdatePrnLrsDto } from './dto/update-prn-lrs.dto';
import { FilterPrnLrsDto } from './dto/filter-prn-lrs.dto';

// Repository — all DB access for `txn_prn_lrs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class PrnLrsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreatePrnLrsDto) {
    return this.prisma.prnLrs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterPrnLrsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.prnLrs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.prnLrs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.prnLrs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdatePrnLrsDto) {
    return this.prisma.prnLrs.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.prnLrs.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
