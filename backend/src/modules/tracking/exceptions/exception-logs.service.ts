import { Injectable, NotFoundException } from '@nestjs/common';
import { ExceptionLogsRepository } from './exception-logs.repository';
import { CreateExceptionLogsDto } from './dto/create-exception-logs.dto';
import { UpdateExceptionLogsDto } from './dto/update-exception-logs.dto';
import { FilterExceptionLogsDto } from './dto/filter-exception-logs.dto';

@Injectable()
export class ExceptionLogsService {
  constructor(private readonly repo: ExceptionLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreateExceptionLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterExceptionLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ExceptionLogs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateExceptionLogsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
