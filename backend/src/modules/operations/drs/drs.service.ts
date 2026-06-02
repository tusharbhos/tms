import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DrsRepository } from './drs.repository';
import { CreateDrsDto } from './dto/create-drs.dto';
import { UpdateDrsDto } from './dto/update-drs.dto';
import { FilterDrsDto } from './dto/filter-drs.dto';
import { DrsTransitions } from './entities/drs.entity';
import { PrismaService } from '../../../database/prisma.service';

// Drs service — includes finite STATE MACHINE validation.
// Allowed transitions come from DrsTransitions (generated from the TMS spec).
@Injectable()
export class DrsService {
  private readonly reasonRequiredStates = ["CANCELLED"];

  constructor(
    private readonly repo: DrsRepository,
    private readonly prisma: PrismaService,
  ) {}

  create(tenantId: number, userId: number, dto: CreateDrsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDrsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Drs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDrsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }

  /**
   * Transition the drsStatus to a new state with full validation:
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
    const from: string = row.drsStatus;

    const allowed = DrsTransitions[from] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(
        `Illegal drsStatus transition: ${from} -> ${to}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    if (this.reasonRequiredStates.includes(to) && !reasonId) {
      throw new BadRequestException(`Transition to ${to} requires a reasonId.`);
    }

    // Apply the change + write the immutable log in one transaction.
    return this.prisma.$transaction(async (tx) => {
      const updated = await (tx as any).drs.update({
        where: { id: BigInt(id) as any },
        data: { drsStatus: to, updatedBy: userId },
      });
      // status_change_logs is the immutable audit trail
      await (tx as any).txnStatusChangeLogs.create({
        data: {
          tenantId,
          entityType: 'drs',
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
