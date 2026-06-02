import { Injectable, NotFoundException } from '@nestjs/common';
import { TripExpensesRepository } from './trip-expenses.repository';
import { CreateTripExpensesDto } from './dto/create-trip-expenses.dto';
import { UpdateTripExpensesDto } from './dto/update-trip-expenses.dto';
import { FilterTripExpensesDto } from './dto/filter-trip-expenses.dto';

@Injectable()
export class TripExpensesService {
  constructor(private readonly repo: TripExpensesRepository) {}

  create(tenantId: number, userId: number, dto: CreateTripExpensesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTripExpensesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TripExpenses not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateTripExpensesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
