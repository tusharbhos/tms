import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateApiIntegrationsDto } from './dto/create-api-integrations.dto';
import { UpdateApiIntegrationsDto } from './dto/update-api-integrations.dto';
import { FilterApiIntegrationsDto } from './dto/filter-api-integrations.dto';

// Repository — all DB access for `api_integrations`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class ApiIntegrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateApiIntegrationsDto) {
    return this.prisma.apiIntegrations.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterApiIntegrationsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.apiIntegrations.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiIntegrations.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.apiIntegrations.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateApiIntegrationsDto) {
    return this.prisma.apiIntegrations.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.apiIntegrations.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
