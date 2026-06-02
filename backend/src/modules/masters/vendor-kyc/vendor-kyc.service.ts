import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorKycRepository } from './vendor-kyc.repository';
import { CreateVendorKycDto } from './dto/create-vendor-kyc.dto';
import { UpdateVendorKycDto } from './dto/update-vendor-kyc.dto';
import { FilterVendorKycDto } from './dto/filter-vendor-kyc.dto';

@Injectable()
export class VendorKycService {
  constructor(private readonly repo: VendorKycRepository) {}

  create(tenantId: number, userId: number, dto: CreateVendorKycDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterVendorKycDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('VendorKyc not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateVendorKycDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
