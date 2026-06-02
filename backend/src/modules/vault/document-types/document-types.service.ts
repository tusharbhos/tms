import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentTypesRepository } from './document-types.repository';
import { CreateDocumentTypesDto } from './dto/create-document-types.dto';
import { UpdateDocumentTypesDto } from './dto/update-document-types.dto';
import { FilterDocumentTypesDto } from './dto/filter-document-types.dto';

@Injectable()
export class DocumentTypesService {
  constructor(private readonly repo: DocumentTypesRepository) {}

  create(tenantId: number, userId: number, dto: CreateDocumentTypesDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDocumentTypesDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DocumentTypes not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateDocumentTypesDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
