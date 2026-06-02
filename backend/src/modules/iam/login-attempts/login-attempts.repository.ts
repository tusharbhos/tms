import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateLoginAttemptsDto } from './dto/create-login-attempts.dto';
import { UpdateLoginAttemptsDto } from './dto/update-login-attempts.dto';
import { FilterLoginAttemptsDto } from './dto/filter-login-attempts.dto';

// Repository — all DB access for `login_attempts`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class LoginAttemptsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateLoginAttemptsDto) {
    return this.prisma.loginAttempts.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterLoginAttemptsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.loginAttempts.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.loginAttempts.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.loginAttempts.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // login_attempts is an IMMUTABLE LOG — no update/delete permitted by design.
}
