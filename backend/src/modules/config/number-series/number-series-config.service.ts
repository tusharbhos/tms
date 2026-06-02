import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { NumberSeriesConfigRepository } from './number-series-config.repository';
import { CreateNumberSeriesConfigDto } from './dto/create-number-series-config.dto';
import { UpdateNumberSeriesConfigDto } from './dto/update-number-series-config.dto';
import { FilterNumberSeriesConfigDto } from './dto/filter-number-series-config.dto';

// NumberSeriesService — CRUD + atomic, race-safe document numbering.
// next() uses SELECT ... FOR UPDATE inside a transaction so two bookings can
// never receive the same number. Format: PREFIX-FY-000123(-SUFFIX)
@Injectable()
export class NumberSeriesConfigService {
  constructor(
    private readonly repo: NumberSeriesConfigRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ── standard CRUD ──
  create(tenantId: number, userId: number, dto: CreateNumberSeriesConfigDto) {
    return this.repo.create(tenantId, userId, dto);
  }
  findAll(tenantId: number, query: FilterNumberSeriesConfigDto) {
    return this.repo.findAll(tenantId, query);
  }
  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('NumberSeriesConfig not found');
    return row;
  }
  update(tenantId: number, userId: number, id: string, dto: UpdateNumberSeriesConfigDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }
  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }

  // ── the important bit: atomic number generation ──
  private financialYear(): string {
    const now = new Date();
    const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1; // Apr start
    return String(y).slice(2) + String(y + 1).slice(2); // e.g. "2526"
  }

  async next(tenantId: number, entityType: string): Promise<string> {
    const fy = this.financialYear();
    return this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRawUnsafe<any[]>(
        `SELECT * FROM masterdata_number_series_config
         WHERE tenant_id = $1 AND entity_type = $2 AND financial_year = $3
         AND is_active = true
         FOR UPDATE`,
        tenantId, entityType, fy,
      );
      if (!rows.length) throw new Error(`No active number series for ${entityType} (FY ${fy})`);
      const cfg = rows[0];
      const nextNo = Number(cfg.current_running_no) + 1;
      await tx.$executeRawUnsafe(
        `UPDATE masterdata_number_series_config SET current_running_no = $1 WHERE id = $2`,
        nextNo, cfg.id,
      );
      const padded = String(nextNo).padStart(cfg.min_digits ?? 6, '0');
      const sep = cfg.separator ?? '-';
      const parts = [cfg.prefix, fy, padded];
      if (cfg.suffix) parts.push(cfg.suffix);
      return parts.join(sep);
    });
  }
}
