import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { FilterCurrencyDto } from './dto/filter-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly repo: CurrencyRepository) {}

  create(tenantId: number, userId: number, dto: CreateCurrencyDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCurrencyDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Currency not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCurrencyDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
