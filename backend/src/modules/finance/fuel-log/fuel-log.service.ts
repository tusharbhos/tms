import { Injectable, NotFoundException } from '@nestjs/common';
import { FuelLogRepository } from './fuel-log.repository';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { UpdateFuelLogDto } from './dto/update-fuel-log.dto';
import { FilterFuelLogDto } from './dto/filter-fuel-log.dto';

@Injectable()
export class FuelLogService {
  constructor(private readonly repo: FuelLogRepository) {}

  create(tenantId: number, userId: number, dto: CreateFuelLogDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterFuelLogDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('FuelLog not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateFuelLogDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
