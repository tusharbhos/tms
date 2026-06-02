import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteMasterRepository } from './route-master.repository';
import { CreateRouteMasterDto } from './dto/create-route-master.dto';
import { UpdateRouteMasterDto } from './dto/update-route-master.dto';
import { FilterRouteMasterDto } from './dto/filter-route-master.dto';

@Injectable()
export class RouteMasterService {
  constructor(private readonly repo: RouteMasterRepository) {}

  create(tenantId: number, userId: number, dto: CreateRouteMasterDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterRouteMasterDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('RouteMaster not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateRouteMasterDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
