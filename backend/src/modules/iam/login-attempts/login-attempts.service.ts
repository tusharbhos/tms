import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginAttemptsRepository } from './login-attempts.repository';
import { CreateLoginAttemptsDto } from './dto/create-login-attempts.dto';
import { UpdateLoginAttemptsDto } from './dto/update-login-attempts.dto';
import { FilterLoginAttemptsDto } from './dto/filter-login-attempts.dto';

@Injectable()
export class LoginAttemptsService {
  constructor(private readonly repo: LoginAttemptsRepository) {}

  create(tenantId: number, userId: number, dto: CreateLoginAttemptsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterLoginAttemptsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('LoginAttempts not found');
    return row;
  }
}
