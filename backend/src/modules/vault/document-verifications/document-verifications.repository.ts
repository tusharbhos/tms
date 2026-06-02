import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateDocumentVerificationsDto } from './dto/create-document-verifications.dto';
import { UpdateDocumentVerificationsDto } from './dto/update-document-verifications.dto';
import { FilterDocumentVerificationsDto } from './dto/filter-document-verifications.dto';

// Repository — all DB access for `document_verifications`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class DocumentVerificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateDocumentVerificationsDto) {
    return this.prisma.documentVerifications.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterDocumentVerificationsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.documentVerifications.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.documentVerifications.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.documentVerifications.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // document_verifications is an IMMUTABLE LOG — no update/delete permitted by design.
}
