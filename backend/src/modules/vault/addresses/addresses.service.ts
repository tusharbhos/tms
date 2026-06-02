import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressesRepository } from './addresses.repository';
import { CreateAddressesDto } from './dto/create-addresses.dto';
import { UpdateAddressesDto } from './dto/update-addresses.dto';
import { FilterAddressesDto } from './dto/filter-addresses.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly repo: AddressesRepository) {}

  create(tenantId: number, userId: number, dto: CreateAddressesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterAddressesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Addresses not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateAddressesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
