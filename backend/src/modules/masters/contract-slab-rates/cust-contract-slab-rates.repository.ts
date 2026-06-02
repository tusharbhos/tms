import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCustContractSlabRatesDto } from './dto/create-cust-contract-slab-rates.dto';
import { UpdateCustContractSlabRatesDto } from './dto/update-cust-contract-slab-rates.dto';
import { FilterCustContractSlabRatesDto } from './dto/filter-cust-contract-slab-rates.dto';

// Repository — all DB access for `cust_contract_slab_rates`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class CustContractSlabRatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateCustContractSlabRatesDto) {
    return this.prisma.custContractSlabRates.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterCustContractSlabRatesDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.custContractSlabRates.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.custContractSlabRates.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.custContractSlabRates.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateCustContractSlabRatesDto) {
    return this.prisma.custContractSlabRates.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.custContractSlabRates.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
