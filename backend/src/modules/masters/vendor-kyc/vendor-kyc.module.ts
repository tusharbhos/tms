import { Module } from '@nestjs/common';
import { VendorKycController } from './vendor-kyc.controller';
import { VendorKycService } from './vendor-kyc.service';
import { VendorKycRepository } from './vendor-kyc.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VendorKycController],
  providers: [VendorKycRepository, VendorKycService],
  exports: [VendorKycService],
})
export class VendorKycModule {}
