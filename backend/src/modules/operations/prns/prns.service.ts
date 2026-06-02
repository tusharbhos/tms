import { Injectable, NotFoundException } from '@nestjs/common';
import { PrnRepository } from './prns.repository';
import { CreatePrnDto } from './dto/create-prn.dto';
import { UpdatePrnDto } from './dto/update-prn.dto';
import { FilterPrnDto } from './dto/filter-prn.dto';

@Injectable()
export class PrnService {
  constructor(private readonly repo: PrnRepository) {}

  create(tenantId: number, userId: number, dto: CreatePrnDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPrnDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Prn not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdatePrnDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
