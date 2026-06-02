import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverTasksRepository } from './driver-tasks.repository';
import { CreateDriverTasksDto } from './dto/create-driver-tasks.dto';
import { UpdateDriverTasksDto } from './dto/update-driver-tasks.dto';
import { FilterDriverTasksDto } from './dto/filter-driver-tasks.dto';

@Injectable()
export class DriverTasksService {
  constructor(private readonly repo: DriverTasksRepository) {}

  create(tenantId: number, userId: number, dto: CreateDriverTasksDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDriverTasksDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DriverTasks not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDriverTasksDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
