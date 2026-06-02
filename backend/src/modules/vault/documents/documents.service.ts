import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentsDto } from './dto/create-documents.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { FilterDocumentsDto } from './dto/filter-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly repo: DocumentsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDocumentsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDocumentsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('Documents not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDocumentsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
