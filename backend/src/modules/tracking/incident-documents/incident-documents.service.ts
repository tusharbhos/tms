import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentDocumentsRepository } from './incident-documents.repository';
import { CreateIncidentDocumentsDto } from './dto/create-incident-documents.dto';
import { UpdateIncidentDocumentsDto } from './dto/update-incident-documents.dto';
import { FilterIncidentDocumentsDto } from './dto/filter-incident-documents.dto';

@Injectable()
export class IncidentDocumentsService {
  constructor(private readonly repo: IncidentDocumentsRepository) {}

  create(tenantId: number, userId: number, dto: CreateIncidentDocumentsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterIncidentDocumentsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('IncidentDocuments not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateIncidentDocumentsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
