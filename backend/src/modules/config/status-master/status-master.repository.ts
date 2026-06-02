import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateStatusMasterDto } from './dto/create-status-master.dto';
import { UpdateStatusMasterDto } from './dto/update-status-master.dto';
import { FilterStatusMasterDto } from './dto/filter-status-master.dto';

// Repository — all DB access for `status_master`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class StatusMasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateStatusMasterDto) {
    return this.prisma.statusMaster.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterStatusMasterDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.statusMaster.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.statusMaster.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.statusMaster.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateStatusMasterDto) {
    return this.prisma.statusMaster.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.statusMaster.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
