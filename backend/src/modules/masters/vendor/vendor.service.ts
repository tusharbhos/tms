import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorRepository } from './vendor.repository';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FilterVendorDto } from './dto/filter-vendor.dto';

@Injectable()
export class VendorService {
  constructor(private readonly repo: VendorRepository) {}

  create(tenantId: number, userId: number, dto: CreateVendorDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterVendorDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Vendor not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateVendorDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
