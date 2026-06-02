import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSessionsRepository } from './user-sessions.repository';
import { CreateUserSessionsDto } from './dto/create-user-sessions.dto';
import { UpdateUserSessionsDto } from './dto/update-user-sessions.dto';
import { FilterUserSessionsDto } from './dto/filter-user-sessions.dto';

@Injectable()
export class UserSessionsService {
  constructor(private readonly repo: UserSessionsRepository) {}

  create(tenantId: number, userId: number, dto: CreateUserSessionsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterUserSessionsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('UserSessions not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateUserSessionsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
