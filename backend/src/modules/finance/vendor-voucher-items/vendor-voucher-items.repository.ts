import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVendorVoucherItemsDto } from './dto/create-vendor-voucher-items.dto';
import { UpdateVendorVoucherItemsDto } from './dto/update-vendor-voucher-items.dto';
import { FilterVendorVoucherItemsDto } from './dto/filter-vendor-voucher-items.dto';

// Repository — all DB access for `txn_vendor_voucher_items`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class VendorVoucherItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateVendorVoucherItemsDto) {
    return this.prisma.vendorVoucherItems.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterVendorVoucherItemsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.vendorVoucherItems.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendorVoucherItems.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.vendorVoucherItems.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateVendorVoucherItemsDto) {
    return this.prisma.vendorVoucherItems.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.vendorVoucherItems.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
