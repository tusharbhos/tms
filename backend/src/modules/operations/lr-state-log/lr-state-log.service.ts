import { Injectable, NotFoundException } from '@nestjs/common';
import { LrStateLogRepository } from './lr-state-log.repository';
import { CreateLrStateLogDto } from './dto/create-lr-state-log.dto';
import { UpdateLrStateLogDto } from './dto/update-lr-state-log.dto';
import { FilterLrStateLogDto } from './dto/filter-lr-state-log.dto';

@Injectable()
export class LrStateLogService {
  constructor(private readonly repo: LrStateLogRepository) {}

  create(tenantId: number, userId: number, dto: CreateLrStateLogDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterLrStateLogDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('LrStateLog not found');
    return row;
  }
}
