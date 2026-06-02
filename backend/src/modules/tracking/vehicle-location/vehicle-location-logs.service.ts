import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleLocationLogsRepository } from './vehicle-location-logs.repository';
import { CreateVehicleLocationLogsDto } from './dto/create-vehicle-location-logs.dto';
import { UpdateVehicleLocationLogsDto } from './dto/update-vehicle-location-logs.dto';
import { FilterVehicleLocationLogsDto } from './dto/filter-vehicle-location-logs.dto';

@Injectable()
export class VehicleLocationLogsService {
  constructor(private readonly repo: VehicleLocationLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateVehicleLocationLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterVehicleLocationLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('VehicleLocationLogs not found');
    return row;
  }
}
