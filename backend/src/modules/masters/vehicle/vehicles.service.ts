import { Injectable, NotFoundException } from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository';
import { CreateVehiclesDto } from './dto/create-vehicles.dto';
import { UpdateVehiclesDto } from './dto/update-vehicles.dto';
import { FilterVehiclesDto } from './dto/filter-vehicles.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly repo: VehiclesRepository) {}

  create(tenantId: number, userId: number, dto: CreateVehiclesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterVehiclesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Vehicles not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateVehiclesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
