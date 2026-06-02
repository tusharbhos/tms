import { TenantModule as TenantMasterModule } from './tenant/tenant.module';
import { TenantKycModule } from './tenant-kyc/tenant-kyc.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CurrencyModule } from './currency/currency.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { TenantFeatureFlagsModule } from './tenant-feature-flags/tenant-feature-flags.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TenantMasterModule,
    TenantKycModule,
    OrganizationsModule,
    CurrencyModule,
    FeatureFlagsModule,
    TenantFeatureFlagsModule
  ],
})
export class TenantModule {}
