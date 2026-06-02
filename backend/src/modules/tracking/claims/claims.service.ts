import { Injectable, NotFoundException } from '@nestjs/common';
import { ClaimsRepository } from './claims.repository';
import { CreateClaimsDto } from './dto/create-claims.dto';
import { UpdateClaimsDto } from './dto/update-claims.dto';
import { FilterClaimsDto } from './dto/filter-claims.dto';

@Injectable()
export class ClaimsService {
  constructor(private readonly repo: ClaimsRepository) {}

  create(tenantId: number, userId: number, dto: CreateClaimsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterClaimsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Claims not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateClaimsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
