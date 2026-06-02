import { Injectable, NotFoundException } from '@nestjs/common';
import { DrsLrsRepository } from './drs-lrs.repository';
import { CreateDrsLrsDto } from './dto/create-drs-lrs.dto';
import { UpdateDrsLrsDto } from './dto/update-drs-lrs.dto';
import { FilterDrsLrsDto } from './dto/filter-drs-lrs.dto';

@Injectable()
export class DrsLrsService {
  constructor(private readonly repo: DrsLrsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDrsLrsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDrsLrsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DrsLrs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDrsLrsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
