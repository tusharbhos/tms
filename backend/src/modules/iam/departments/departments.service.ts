import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentsDto } from './dto/create-departments.dto';
import { UpdateDepartmentsDto } from './dto/update-departments.dto';
import { FilterDepartmentsDto } from './dto/filter-departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly repo: DepartmentsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDepartmentsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDepartmentsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Departments not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDepartmentsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
