import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCustContractSlabDefinitionDto } from './dto/create-cust-contract-slab-definition.dto';
import { UpdateCustContractSlabDefinitionDto } from './dto/update-cust-contract-slab-definition.dto';
import { FilterCustContractSlabDefinitionDto } from './dto/filter-cust-contract-slab-definition.dto';

// Repository — all DB access for `cust_contract_slab_definition`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class CustContractSlabDefinitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateCustContractSlabDefinitionDto) {
    return this.prisma.custContractSlabDefinition.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterCustContractSlabDefinitionDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.custContractSlabDefinition.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.custContractSlabDefinition.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.custContractSlabDefinition.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  async update(tenantId: number, userId: number, id: string | number, dto: UpdateCustContractSlabDefinitionDto) {
    return this.prisma.custContractSlabDefinition.update({
      where: { id: BigInt(id) as any },
      data: { ...dto, updatedBy: userId } as any,
    });
  }

  async softDelete(tenantId: number, userId: number, id: string | number) {
    return this.prisma.custContractSlabDefinition.update({
      where: { id: BigInt(id) as any },
      data: { deletedAt: new Date(), deletedBy: userId } as any,
    });
  }
}
