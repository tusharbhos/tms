import { Module } from '@nestjs/common';
import { ManifestLrsController } from './manifest-lrs.controller';
import { ManifestLrsService } from './manifest-lrs.service';
import { ManifestLrsRepository } from './manifest-lrs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManifestLrsController],
  providers: [ManifestLrsRepository, ManifestLrsService],
  exports: [ManifestLrsService],
})
export class ManifestLrsModule {}
