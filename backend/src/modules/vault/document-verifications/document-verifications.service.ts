import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentVerificationsRepository } from './document-verifications.repository';
import { CreateDocumentVerificationsDto } from './dto/create-document-verifications.dto';
import { UpdateDocumentVerificationsDto } from './dto/update-document-verifications.dto';
import { FilterDocumentVerificationsDto } from './dto/filter-document-verifications.dto';

@Injectable()
export class DocumentVerificationsService {
  constructor(private readonly repo: DocumentVerificationsRepository) {}

  create(tenantId: number, userId: number, dto: CreateDocumentVerificationsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterDocumentVerificationsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('DocumentVerifications not found');
    return row;
  }
}
