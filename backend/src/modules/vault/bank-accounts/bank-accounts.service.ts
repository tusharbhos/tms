import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository } from './bank-accounts.repository';
import { CreateBankAccountsDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountsDto } from './dto/update-bank-accounts.dto';
import { FilterBankAccountsDto } from './dto/filter-bank-accounts.dto';

@Injectable()
export class BankAccountsService {
  constructor(private readonly repo: BankAccountsRepository) {}

  create(tenantId: number, userId: number, dto: CreateBankAccountsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterBankAccountsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('BankAccounts not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateBankAccountsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
