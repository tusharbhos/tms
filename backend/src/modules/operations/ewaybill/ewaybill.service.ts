import { Injectable, NotFoundException } from '@nestjs/common';
import { EwaybillRepository } from './ewaybill.repository';
import { CreateEwaybillDto } from './dto/create-ewaybill.dto';
import { UpdateEwaybillDto } from './dto/update-ewaybill.dto';
import { FilterEwaybillDto } from './dto/filter-ewaybill.dto';

@Injectable()
export class EwaybillService {
  constructor(private readonly repo: EwaybillRepository) {}

  create(tenantId: number, userId: number, dto: CreateEwaybillDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterEwaybillDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Ewaybill not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateEwaybillDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
