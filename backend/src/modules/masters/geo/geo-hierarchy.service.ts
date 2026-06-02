import { Injectable, NotFoundException } from '@nestjs/common';
import { GeoHierarchyRepository } from './geo-hierarchy.repository';
import { CreateGeoHierarchyDto } from './dto/create-geo-hierarchy.dto';
import { UpdateGeoHierarchyDto } from './dto/update-geo-hierarchy.dto';
import { FilterGeoHierarchyDto } from './dto/filter-geo-hierarchy.dto';

@Injectable()
export class GeoHierarchyService {
  constructor(private readonly repo: GeoHierarchyRepository) {}

  create(tenantId: number, userId: number, dto: CreateGeoHierarchyDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterGeoHierarchyDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('GeoHierarchy not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateGeoHierarchyDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
