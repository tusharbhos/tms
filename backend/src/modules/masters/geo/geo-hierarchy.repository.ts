import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateGeoHierarchyDto } from './dto/create-geo-hierarchy.dto';
import { UpdateGeoHierarchyDto } from './dto/update-geo-hierarchy.dto';
import { FilterGeoHierarchyDto } from './dto/filter-geo-hierarchy.dto';

// Repository — all DB access for `geo_hierarchy`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class GeoHierarchyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateGeoHierarchyDto) {
    return this.prisma.geoHierarchy.create({
      data: { ...dto, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterGeoHierarchyDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = {  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.geoHierarchy.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.geoHierarchy.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.geoHierarchy.findFirst({
      where: { id: BigInt(id) as any,  },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateGeoHierarchyDto) {
    return this.prisma.geoHierarchy.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.geoHierarchy.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
