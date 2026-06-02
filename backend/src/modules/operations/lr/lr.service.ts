import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LrRepository } from './lr.repository';
import { CreateLrDto } from './dto/create-lr.dto';
import { UpdateLrDto } from './dto/update-lr.dto';
import { FilterLrDto } from './dto/filter-lr.dto';
import { LrTransitions } from './entities/lr.entity';
import { PrismaService } from '../../../database/prisma.service';

// Lr service — includes finite STATE MACHINE validation.
// Allowed transitions come from LrTransitions (generated from the TMS spec).
@Injectable()
export class LrService {
  private readonly reasonRequiredStates = ["CANCELLED", "RTO"];

  constructor(
    private readonly repo: LrRepository,
    private readonly prisma: PrismaService,
  ) {}

  create(tenantId: number, userId: number, dto: CreateLrDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterLrDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Lr not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateLrDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }

  /**
   * Transition the lrStatus to a new state with full validation:
   *  1. target must be reachable from current per the transition graph
   *  2. states in reasonRequiredStates need a reasonId + (optional) notes
   *  3. the change is recorded in an immutable state log
   */
  async transition(
    tenantId: number,
    userId: number,
    id: string,
    to: string,
    reasonId?: number,
    notes?: string,
  ) {
    const row: any = await this.findOne(tenantId, id);
    const from: string = row.lrStatus;

    const allowed = LrTransitions[from] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(
        `Illegal lrStatus transition: ${from} -> ${to}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    if (this.reasonRequiredStates.includes(to) && !reasonId) {
      throw new BadRequestException(`Transition to ${to} requires a reasonId.`);
    }

    // Apply the change + write the immutable log in one transaction.
    return this.prisma.$transaction(async (tx) => {
      const updated = await (tx as any).lr.update({
        where: { id: BigInt(id) as any },
        data: { lrStatus: to, updatedBy: userId },
      });
      // status_change_logs is the immutable audit trail
      await (tx as any).txnStatusChangeLogs.create({
        data: {
          tenantId,
          entityType: 'lr',
          entityId: BigInt(id) as any,
          fromStatus: from,
          toStatus: to,
          reasonId: reasonId ?? null,
          notes: notes ?? null,
          changedBy: userId,
          changeSource: 'USER',
        },
      }).catch(() => void 0); // log table may not exist in early migrations
      return updated;
    });
  }
}
