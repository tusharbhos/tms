import { Injectable, NotFoundException } from '@nestjs/common';
import { SecurityEventsRepository } from './security-events.repository';
import { CreateSecurityEventsDto } from './dto/create-security-events.dto';
import { UpdateSecurityEventsDto } from './dto/update-security-events.dto';
import { FilterSecurityEventsDto } from './dto/filter-security-events.dto';

@Injectable()
export class SecurityEventsService {
  constructor(private readonly repo: SecurityEventsRepository) {}

  create(tenantId: number, userId: number, dto: CreateSecurityEventsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterSecurityEventsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('SecurityEvents not found');
    return row;
  }
}
