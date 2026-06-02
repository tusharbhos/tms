import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationsDto } from './dto/create-organizations.dto';
import { UpdateOrganizationsDto } from './dto/update-organizations.dto';
import { FilterOrganizationsDto } from './dto/filter-organizations.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly repo: OrganizationsRepository) {}

  create(tenantId: number, userId: number, dto: CreateOrganizationsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterOrganizationsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Organizations not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateOrganizationsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
