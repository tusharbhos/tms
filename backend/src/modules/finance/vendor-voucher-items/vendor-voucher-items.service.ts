import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorVoucherItemsRepository } from './vendor-voucher-items.repository';
import { CreateVendorVoucherItemsDto } from './dto/create-vendor-voucher-items.dto';
import { UpdateVendorVoucherItemsDto } from './dto/update-vendor-voucher-items.dto';
import { FilterVendorVoucherItemsDto } from './dto/filter-vendor-voucher-items.dto';

@Injectable()
export class VendorVoucherItemsService {
  constructor(private readonly repo: VendorVoucherItemsRepository) {}

  create(tenantId: number, userId: number, dto: CreateVendorVoucherItemsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterVendorVoucherItemsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('VendorVoucherItems not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateVendorVoucherItemsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
