import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreatePackageScanLogsDto } from './dto/create-package-scan-logs.dto';
import { UpdatePackageScanLogsDto } from './dto/update-package-scan-logs.dto';
import { FilterPackageScanLogsDto } from './dto/filter-package-scan-logs.dto';

// Repository — all DB access for `txn_package_scan_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class PackageScanLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreatePackageScanLogsDto) {
    return this.prisma.packageScanLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterPackageScanLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    if (!includeDeleted) where.deletedAt = null;
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.packageScanLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.packageScanLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.packageScanLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_package_scan_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
