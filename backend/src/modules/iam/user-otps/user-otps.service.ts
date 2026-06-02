import { Injectable, NotFoundException } from '@nestjs/common';
import { UserOtpsRepository } from './user-otps.repository';
import { CreateUserOtpsDto } from './dto/create-user-otps.dto';
import { UpdateUserOtpsDto } from './dto/update-user-otps.dto';
import { FilterUserOtpsDto } from './dto/filter-user-otps.dto';

@Injectable()
export class UserOtpsService {
  constructor(private readonly repo: UserOtpsRepository) {}

  create(tenantId: number, userId: number, dto: CreateUserOtpsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterUserOtpsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('UserOtps not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateUserOtpsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
