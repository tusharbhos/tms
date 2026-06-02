import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTrackingEventsDto } from './dto/create-tracking-events.dto';
import { UpdateTrackingEventsDto } from './dto/update-tracking-events.dto';
import { FilterTrackingEventsDto } from './dto/filter-tracking-events.dto';

// Repository — all DB access for `txn_tracking_events`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class TrackingEventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateTrackingEventsDto) {
    return this.prisma.trackingEvents.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterTrackingEventsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.trackingEvents.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trackingEvents.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.trackingEvents.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_tracking_events is an IMMUTABLE LOG — no update/delete permitted by design.
}
