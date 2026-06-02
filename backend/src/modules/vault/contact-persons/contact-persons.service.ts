import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactPersonsRepository } from './contact-persons.repository';
import { CreateContactPersonsDto } from './dto/create-contact-persons.dto';
import { UpdateContactPersonsDto } from './dto/update-contact-persons.dto';
import { FilterContactPersonsDto } from './dto/filter-contact-persons.dto';

@Injectable()
export class ContactPersonsService {
  constructor(private readonly repo: ContactPersonsRepository) {}

  create(tenantId: number, userId: number, dto: CreateContactPersonsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterContactPersonsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ContactPersons not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateContactPersonsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
