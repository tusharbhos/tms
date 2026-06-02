import { Injectable, NotFoundException } from '@nestjs/common';
import { LoaderExpenseRepository } from './loader-expense.repository';
import { CreateLoaderExpenseDto } from './dto/create-loader-expense.dto';
import { UpdateLoaderExpenseDto } from './dto/update-loader-expense.dto';
import { FilterLoaderExpenseDto } from './dto/filter-loader-expense.dto';

@Injectable()
export class LoaderExpenseService {
  constructor(private readonly repo: LoaderExpenseRepository) {}

  create(tenantId: number, userId: number, dto: CreateLoaderExpenseDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterLoaderExpenseDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('LoaderExpense not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateLoaderExpenseDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
