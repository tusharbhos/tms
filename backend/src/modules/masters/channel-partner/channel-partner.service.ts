import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelPartnerRepository } from './channel-partner.repository';
import { CreateChannelPartnerDto } from './dto/create-channel-partner.dto';
import { UpdateChannelPartnerDto } from './dto/update-channel-partner.dto';
import { FilterChannelPartnerDto } from './dto/filter-channel-partner.dto';

@Injectable()
export class ChannelPartnerService {
  constructor(private readonly repo: ChannelPartnerRepository) {}

  create(tenantId: number, userId: number, dto: CreateChannelPartnerDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterChannelPartnerDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ChannelPartner not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateChannelPartnerDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
