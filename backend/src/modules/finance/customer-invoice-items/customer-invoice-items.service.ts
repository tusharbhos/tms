import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerInvoiceItemsRepository } from './customer-invoice-items.repository';
import { CreateCustomerInvoiceItemsDto } from './dto/create-customer-invoice-items.dto';
import { UpdateCustomerInvoiceItemsDto } from './dto/update-customer-invoice-items.dto';
import { FilterCustomerInvoiceItemsDto } from './dto/filter-customer-invoice-items.dto';

@Injectable()
export class CustomerInvoiceItemsService {
  constructor(private readonly repo: CustomerInvoiceItemsRepository) {}

  create(tenantId: number, userId: number, dto: CreateCustomerInvoiceItemsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterCustomerInvoiceItemsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('CustomerInvoiceItems not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateCustomerInvoiceItemsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
