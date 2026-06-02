import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCustomerInvoiceItemsDto } from './dto/create-customer-invoice-items.dto';
import { UpdateCustomerInvoiceItemsDto } from './dto/update-customer-invoice-items.dto';
import { FilterCustomerInvoiceItemsDto } from './dto/filter-customer-invoice-items.dto';

// Repository — all DB access for `txn_customer_invoice_items`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class CustomerInvoiceItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateCustomerInvoiceItemsDto) {
    return this.prisma.customerInvoiceItems.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterCustomerInvoiceItemsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.customerInvoiceItems.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customerInvoiceItems.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.customerInvoiceItems.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateCustomerInvoiceItemsDto) {
    return this.prisma.customerInvoiceItems.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.customerInvoiceItems.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
