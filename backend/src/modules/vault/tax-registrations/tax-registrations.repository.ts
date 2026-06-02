import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTaxRegistrationsDto } from './dto/create-tax-registrations.dto';
import { UpdateTaxRegistrationsDto } from './dto/update-tax-registrations.dto';
import { FilterTaxRegistrationsDto } from './dto/filter-tax-registrations.dto';

// Repository — all DB access for `tax_registrations`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class TaxRegistrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateTaxRegistrationsDto) {
    return this.prisma.taxRegistrations.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterTaxRegistrationsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.taxRegistrations.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.taxRegistrations.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.taxRegistrations.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateTaxRegistrationsDto) {
    return this.prisma.taxRegistrations.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.taxRegistrations.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
