import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageScanLogsRepository } from './package-scan-logs.repository';
import { CreatePackageScanLogsDto } from './dto/create-package-scan-logs.dto';
import { UpdatePackageScanLogsDto } from './dto/update-package-scan-logs.dto';
import { FilterPackageScanLogsDto } from './dto/filter-package-scan-logs.dto';

@Injectable()
export class PackageScanLogsService {
  constructor(private readonly repo: PackageScanLogsRepository) {}

  create(tenantId: number, userId: number, dto: CreatePackageScanLogsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPackageScanLogsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('PackageScanLogs not found');
    return row;
  }
}
