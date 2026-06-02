import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingChargesRepository } from './booking-charges.repository';
import { CreateBookingChargesDto } from './dto/create-booking-charges.dto';
import { UpdateBookingChargesDto } from './dto/update-booking-charges.dto';
import { FilterBookingChargesDto } from './dto/filter-booking-charges.dto';

@Injectable()
export class BookingChargesService {
  constructor(private readonly repo: BookingChargesRepository) {}

  create(tenantId: number, userId: number, dto: CreateBookingChargesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterBookingChargesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('BookingCharges not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateBookingChargesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
