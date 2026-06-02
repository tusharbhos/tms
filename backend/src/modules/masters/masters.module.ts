import { CompanyModule } from './company/company.module';
import { OfficeModule } from './office/office.module';
import { CpKycModule } from './cp-kyc/cp-kyc.module';
import { ChannelPartnerModule } from './channel-partner/channel-partner.module';
import { VendorModule } from './vendor/vendor.module';
import { VendorKycModule } from './vendor-kyc/vendor-kyc.module';
import { CustomerModule } from './customer/customer.module';
import { VehiclesModule } from './vehicle/vehicles.module';
import { DriverModule } from './driver/driver.module';
import { GeoHierarchyModule } from './geo/geo-hierarchy.module';
import { StationCoverageModule } from './station-coverage/station-coverage.module';
import { LoaderRateModule } from './loader-rate/loader-rate.module';
import { DriverRateModule } from './driver-rate/driver-rate.module';
import { CustContractModule } from './contract/cust-contract.module';
import { CustContractSlabDefinitionModule } from './contract-slab-definition/cust-contract-slab-definition.module';
import { CustContractSlabRatesModule } from './contract-slab-rates/cust-contract-slab-rates.module';
import { CustContractExcessWeightModule } from './contract-excess-weight/cust-contract-excess-weight.module';
import { CustContractOdaChargesModule } from './contract-oda-charges/cust-contract-oda-charges.module';
import { WorkflowMasterModule } from './workflow-master/workflow-master.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CompanyModule,
    OfficeModule,
    CpKycModule,
    ChannelPartnerModule,
    VendorModule,
    VendorKycModule,
    CustomerModule,
    VehiclesModule,
    DriverModule,
    GeoHierarchyModule,
    StationCoverageModule,
    LoaderRateModule,
    DriverRateModule,
    CustContractModule,
    CustContractSlabDefinitionModule,
    CustContractSlabRatesModule,
    CustContractExcessWeightModule,
    CustContractOdaChargesModule,
    WorkflowMasterModule
  ],
})
export class MastersModule {}
