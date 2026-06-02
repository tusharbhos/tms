import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreatePrivilegesDto } from './dto/create-privileges.dto';
import { UpdatePrivilegesDto } from './dto/update-privileges.dto';
import { FilterPrivilegesDto } from './dto/filter-privileges.dto';

// Repository — all DB access for `privileges`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class PrivilegesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreatePrivilegesDto) {
    return this.prisma.privileges.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterPrivilegesDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.privileges.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.privileges.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.privileges.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdatePrivilegesDto) {
    return this.prisma.privileges.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.privileges.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
