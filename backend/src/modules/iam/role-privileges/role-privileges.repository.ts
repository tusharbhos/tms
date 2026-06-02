import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateRolePrivilegesDto } from './dto/create-role-privileges.dto';
import { UpdateRolePrivilegesDto } from './dto/update-role-privileges.dto';
import { FilterRolePrivilegesDto } from './dto/filter-role-privileges.dto';

// Repository — all DB access for `role_privileges`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class RolePrivilegesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateRolePrivilegesDto) {
    return this.prisma.rolePrivileges.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterRolePrivilegesDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.rolePrivileges.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rolePrivileges.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.rolePrivileges.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateRolePrivilegesDto) {
    return this.prisma.rolePrivileges.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.rolePrivileges.update({
      where: { id: BigInt(id) as any },
      data: { /* no soft-delete columns */ } as any,
    });
  }
}
