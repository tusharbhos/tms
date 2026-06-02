import { Injectable, NotFoundException } from '@nestjs/common';
import { TripLrsRepository } from './trip-lrs.repository';
import { CreateTripLrsDto } from './dto/create-trip-lrs.dto';
import { UpdateTripLrsDto } from './dto/update-trip-lrs.dto';
import { FilterTripLrsDto } from './dto/filter-trip-lrs.dto';

@Injectable()
export class TripLrsService {
  constructor(private readonly repo: TripLrsRepository) {}

  create(tenantId: number, userId: number, dto: CreateTripLrsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTripLrsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TripLrs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateTripLrsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
