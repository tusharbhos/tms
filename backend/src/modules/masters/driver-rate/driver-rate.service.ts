import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRateRepository } from './driver-rate.repository';
import { CreateDriverRateDto } from './dto/create-driver-rate.dto';
import { UpdateDriverRateDto } from './dto/update-driver-rate.dto';
import { FilterDriverRateDto } from './dto/filter-driver-rate.dto';

@Injectable()
export class DriverRateService {
  constructor(private readonly repo: DriverRateRepository) {}

  create(tenantId: number, userId: number, dto: CreateDriverRateDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDriverRateDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DriverRate not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDriverRateDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
