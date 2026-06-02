import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from './driver.repository';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';

@Injectable()
export class DriverService {
  constructor(private readonly repo: DriverRepository) {}

  create(tenantId: number, userId: number, dto: CreateDriverDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDriverDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Driver not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDriverDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
