import { Injectable, NotFoundException } from '@nestjs/common';
import { StationCoverageRepository } from './station-coverage.repository';
import { CreateStationCoverageDto } from './dto/create-station-coverage.dto';
import { UpdateStationCoverageDto } from './dto/update-station-coverage.dto';
import { FilterStationCoverageDto } from './dto/filter-station-coverage.dto';

@Injectable()
export class StationCoverageService {
  constructor(private readonly repo: StationCoverageRepository) {}

  create(tenantId: number, userId: number, dto: CreateStationCoverageDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterStationCoverageDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('StationCoverage not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateStationCoverageDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
