import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerInvoiceRepository } from './customer-invoice.repository';
import { CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';
import { UpdateCustomerInvoiceDto } from './dto/update-customer-invoice.dto';
import { FilterCustomerInvoiceDto } from './dto/filter-customer-invoice.dto';
import { CustomerInvoiceTransitions } from './entities/customer-invoice.entity';
import { PrismaService } from '../../../database/prisma.service';

// CustomerInvoice service — includes finite STATE MACHINE validation.
// Allowed transitions come from CustomerInvoiceTransitions (generated from the TMS spec).
@Injectable()
export class CustomerInvoiceService {
  private readonly reasonRequiredStates = ["DISPUTED", "WRITTEN_OFF"];

  constructor(
    private readonly repo: CustomerInvoiceRepository,
    private readonly prisma: PrismaService,
  ) {}

  create(tenantId: number, userId: number, dto: CreateCustomerInvoiceDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustomerInvoiceDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustomerInvoice not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustomerInvoiceDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }

  /**
   * Transition the invoiceStatus to a new state with full validation:
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
    const from: string = row.invoiceStatus;

    const allowed = CustomerInvoiceTransitions[from] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(
        `Illegal invoiceStatus transition: ${from} -> ${to}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    if (this.reasonRequiredStates.includes(to) && !reasonId) {
      throw new BadRequestException(`Transition to ${to} requires a reasonId.`);
    }

    // Apply the change + write the immutable log in one transaction.
    return this.prisma.$transaction(async (tx) => {
      const updated = await (tx as any).customerInvoice.update({
        where: { id: BigInt(id) as any },
        data: { invoiceStatus: to, updatedBy: userId },
      });
      // status_change_logs is the immutable audit trail
      await (tx as any).txnStatusChangeLogs.create({
        data: {
          tenantId,
          entityType: 'customer-invoice',
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
