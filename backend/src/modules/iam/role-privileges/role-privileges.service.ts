import { Injectable, NotFoundException } from '@nestjs/common';
import { RolePrivilegesRepository } from './role-privileges.repository';
import { CreateRolePrivilegesDto } from './dto/create-role-privileges.dto';
import { UpdateRolePrivilegesDto } from './dto/update-role-privileges.dto';
import { FilterRolePrivilegesDto } from './dto/filter-role-privileges.dto';

@Injectable()
export class RolePrivilegesService {
  constructor(private readonly repo: RolePrivilegesRepository) {}

  create(tenantId: number, userId: number, dto: CreateRolePrivilegesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterRolePrivilegesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('RolePrivileges not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateRolePrivilegesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
