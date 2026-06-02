import { Injectable, NotFoundException } from '@nestjs/common';
import { PrnLrsRepository } from './prn-lrs.repository';
import { CreatePrnLrsDto } from './dto/create-prn-lrs.dto';
import { UpdatePrnLrsDto } from './dto/update-prn-lrs.dto';
import { FilterPrnLrsDto } from './dto/filter-prn-lrs.dto';

@Injectable()
export class PrnLrsService {
  constructor(private readonly repo: PrnLrsRepository) {}

  create(tenantId: number, userId: number, dto: CreatePrnLrsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPrnLrsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('PrnLrs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdatePrnLrsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
