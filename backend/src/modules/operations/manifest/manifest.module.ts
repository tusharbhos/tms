import { Module } from '@nestjs/common';
import { ManifestController } from './manifest.controller';
import { ManifestService } from './manifest.service';
import { ManifestRepository } from './manifest.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManifestController],
  providers: [ManifestRepository, ManifestService],
  exports: [ManifestService],
})
export class ManifestModule {}
