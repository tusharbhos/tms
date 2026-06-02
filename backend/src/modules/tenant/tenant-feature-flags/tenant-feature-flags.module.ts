import { Module } from '@nestjs/common';
import { TenantFeatureFlagsController } from './tenant-feature-flags.controller';
import { TenantFeatureFlagsService } from './tenant-feature-flags.service';
import { TenantFeatureFlagsRepository } from './tenant-feature-flags.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantFeatureFlagsController],
  providers: [TenantFeatureFlagsRepository, TenantFeatureFlagsService],
  exports: [TenantFeatureFlagsService],
})
export class TenantFeatureFlagsModule {}
