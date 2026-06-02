import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateIncidentDocumentsDto } from './dto/create-incident-documents.dto';
import { UpdateIncidentDocumentsDto } from './dto/update-incident-documents.dto';
import { FilterIncidentDocumentsDto } from './dto/filter-incident-documents.dto';

// Repository — all DB access for `txn_incident_documents`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class IncidentDocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateIncidentDocumentsDto) {
    return this.prisma.incidentDocuments.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterIncidentDocumentsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.incidentDocuments.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.incidentDocuments.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.incidentDocuments.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateIncidentDocumentsDto) {
    return this.prisma.incidentDocuments.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.incidentDocuments.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
