import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateSecurityEventsDto } from './dto/create-security-events.dto';
import { UpdateSecurityEventsDto } from './dto/update-security-events.dto';
import { FilterSecurityEventsDto } from './dto/filter-security-events.dto';

// Repository — all DB access for `security_events`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class SecurityEventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateSecurityEventsDto) {
    return this.prisma.securityEvents.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterSecurityEventsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.securityEvents.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.securityEvents.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.securityEvents.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // security_events is an IMMUTABLE LOG — no update/delete permitted by design.
}
