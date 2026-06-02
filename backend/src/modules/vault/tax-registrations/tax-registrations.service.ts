import { Injectable, NotFoundException } from '@nestjs/common';
import { TaxRegistrationsRepository } from './tax-registrations.repository';
import { CreateTaxRegistrationsDto } from './dto/create-tax-registrations.dto';
import { UpdateTaxRegistrationsDto } from './dto/update-tax-registrations.dto';
import { FilterTaxRegistrationsDto } from './dto/filter-tax-registrations.dto';

@Injectable()
export class TaxRegistrationsService {
  constructor(private readonly repo: TaxRegistrationsRepository) {}

  create(tenantId: number, userId: number, dto: CreateTaxRegistrationsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTaxRegistrationsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TaxRegistrations not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateTaxRegistrationsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
