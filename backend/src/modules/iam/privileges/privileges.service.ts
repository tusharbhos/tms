import { Injectable, NotFoundException } from '@nestjs/common';
import { PrivilegesRepository } from './privileges.repository';
import { CreatePrivilegesDto } from './dto/create-privileges.dto';
import { UpdatePrivilegesDto } from './dto/update-privileges.dto';
import { FilterPrivilegesDto } from './dto/filter-privileges.dto';

@Injectable()
export class PrivilegesService {
  constructor(private readonly repo: PrivilegesRepository) {}

  create(tenantId: number, userId: number, dto: CreatePrivilegesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPrivilegesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Privileges not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdatePrivilegesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
