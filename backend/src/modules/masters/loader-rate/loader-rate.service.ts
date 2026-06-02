import { Injectable, NotFoundException } from '@nestjs/common';
import { LoaderRateRepository } from './loader-rate.repository';
import { CreateLoaderRateDto } from './dto/create-loader-rate.dto';
import { UpdateLoaderRateDto } from './dto/update-loader-rate.dto';
import { FilterLoaderRateDto } from './dto/filter-loader-rate.dto';

@Injectable()
export class LoaderRateService {
  constructor(private readonly repo: LoaderRateRepository) {}

  create(tenantId: number, userId: number, dto: CreateLoaderRateDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterLoaderRateDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('LoaderRate not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateLoaderRateDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
