import { Injectable, NotFoundException } from '@nestjs/common';
import { PrnBookingsRepository } from './prn-bookings.repository';
import { CreatePrnBookingsDto } from './dto/create-prn-bookings.dto';
import { UpdatePrnBookingsDto } from './dto/update-prn-bookings.dto';
import { FilterPrnBookingsDto } from './dto/filter-prn-bookings.dto';

@Injectable()
export class PrnBookingsService {
  constructor(private readonly repo: PrnBookingsRepository) {}

  create(tenantId: number, userId: number, dto: CreatePrnBookingsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPrnBookingsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('PrnBookings not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdatePrnBookingsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
