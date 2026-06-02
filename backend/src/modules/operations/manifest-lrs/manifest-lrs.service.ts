import { Injectable, NotFoundException } from '@nestjs/common';
import { ManifestLrsRepository } from './manifest-lrs.repository';
import { CreateManifestLrsDto } from './dto/create-manifest-lrs.dto';
import { UpdateManifestLrsDto } from './dto/update-manifest-lrs.dto';
import { FilterManifestLrsDto } from './dto/filter-manifest-lrs.dto';

@Injectable()
export class ManifestLrsService {
  constructor(private readonly repo: ManifestLrsRepository) {}

  create(tenantId: number, userId: number, dto: CreateManifestLrsDto) {
    return this.repo.create(tenantId, userId, dto);
  }

  findAll(tenantId: number, query: FilterManifestLrsDto) {
    return this.repo.findAll(tenantId, query);
  }

  async findOne(tenantId: number, id: string) {
    const row = await this.repo.findOne(tenantId, id);
    if (!row) throw new NotFoundException('ManifestLrs not found');
    return row;
  }

  update(tenantId: number, userId: number, id: string, dto: UpdateManifestLrsDto) {
    return this.repo.update(tenantId, userId, id, dto);
  }

  remove(tenantId: number, userId: number, id: string) {
    return this.repo.softDelete(tenantId, userId, id);
  }
}
