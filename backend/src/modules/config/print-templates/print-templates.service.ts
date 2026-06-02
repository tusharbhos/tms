import { Injectable, NotFoundException } from '@nestjs/common';
import { PrintTemplatesRepository } from './print-templates.repository';
import { CreatePrintTemplatesDto } from './dto/create-print-templates.dto';
import { UpdatePrintTemplatesDto } from './dto/update-print-templates.dto';
import { FilterPrintTemplatesDto } from './dto/filter-print-templates.dto';

@Injectable()
export class PrintTemplatesService {
  constructor(private readonly repo: PrintTemplatesRepository) {}

  create(tenantId: number, userId: number, dto: CreatePrintTemplatesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterPrintTemplatesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('PrintTemplates not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdatePrintTemplatesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
