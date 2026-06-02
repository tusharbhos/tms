import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVendorVoucherDto } from './dto/create-vendor-voucher.dto';
import { UpdateVendorVoucherDto } from './dto/update-vendor-voucher.dto';
import { FilterVendorVoucherDto } from './dto/filter-vendor-voucher.dto';

// Repository — all DB access for `txn_vendor_voucher`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class VendorVoucherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateVendorVoucherDto) {
    return this.prisma.vendorVoucher.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterVendorVoucherDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.vendorVoucher.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendorVoucher.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.vendorVoucher.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateVendorVoucherDto) {
    return this.prisma.vendorVoucher.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.vendorVoucher.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
