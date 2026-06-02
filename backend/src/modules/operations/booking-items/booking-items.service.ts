import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingItemsRepository } from './booking-items.repository';
import { CreateBookingItemsDto } from './dto/create-booking-items.dto';
import { UpdateBookingItemsDto } from './dto/update-booking-items.dto';
import { FilterBookingItemsDto } from './dto/filter-booking-items.dto';

@Injectable()
export class BookingItemsService {
  constructor(private readonly repo: BookingItemsRepository) {}

  create(tenantId: number, userId: number, dto: CreateBookingItemsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterBookingItemsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('BookingItems not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateBookingItemsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
