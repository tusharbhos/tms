import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackingEventsRepository } from './tracking-events.repository';
import { CreateTrackingEventsDto } from './dto/create-tracking-events.dto';
import { UpdateTrackingEventsDto } from './dto/update-tracking-events.dto';
import { FilterTrackingEventsDto } from './dto/filter-tracking-events.dto';

@Injectable()
export class TrackingEventsService {
  constructor(private readonly repo: TrackingEventsRepository) {}

  create(tenantId: number, userId: number, dto: CreateTrackingEventsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterTrackingEventsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('TrackingEvents not found');
    return row;
  }
}
