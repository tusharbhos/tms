import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateIncidentTypeMasterDto } from './dto/create-incident-type-master.dto';
import { UpdateIncidentTypeMasterDto } from './dto/update-incident-type-master.dto';
import { FilterIncidentTypeMasterDto } from './dto/filter-incident-type-master.dto';

// Repository — all DB access for `incident_type_master`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class IncidentTypeMasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateIncidentTypeMasterDto) {
    return this.prisma.incidentTypeMaster.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterIncidentTypeMasterDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.incidentTypeMaster.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.incidentTypeMaster.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.incidentTypeMaster.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateIncidentTypeMasterDto) {
    return this.prisma.incidentTypeMaster.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.incidentTypeMaster.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
