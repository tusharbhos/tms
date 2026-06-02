import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { FilterTenantDto } from './dto/filter-tenant.dto';

// Repository — all DB access for `tenant`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterTenantDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.tenant.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.tenant.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
