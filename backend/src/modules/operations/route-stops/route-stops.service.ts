import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteStopsRepository } from './route-stops.repository';
import { CreateRouteStopsDto } from './dto/create-route-stops.dto';
import { UpdateRouteStopsDto } from './dto/update-route-stops.dto';
import { FilterRouteStopsDto } from './dto/filter-route-stops.dto';

@Injectable()
export class RouteStopsService {
  constructor(private readonly repo: RouteStopsRepository) {}

  create(tenantId: number, userId: number, dto: CreateRouteStopsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterRouteStopsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('RouteStops not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateRouteStopsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
