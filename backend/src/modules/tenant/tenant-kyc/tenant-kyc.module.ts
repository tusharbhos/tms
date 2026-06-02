import { Module } from '@nestjs/common';
import { TenantKycController } from './tenant-kyc.controller';
import { TenantKycService } from './tenant-kyc.service';
import { TenantKycRepository } from './tenant-kyc.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantKycController],
  providers: [TenantKycRepository, TenantKycService],
  exports: [TenantKycService],
})
export class TenantKycModule {}
