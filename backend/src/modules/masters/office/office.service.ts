import { Injectable, NotFoundException } from '@nestjs/common';
import { OfficeRepository } from './office.repository';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { FilterOfficeDto } from './dto/filter-office.dto';

@Injectable()
export class OfficeService {
  constructor(private readonly repo: OfficeRepository) {}

  create(tenantId: number, userId: number, dto: CreateOfficeDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterOfficeDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Office not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateOfficeDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
