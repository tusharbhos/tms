import { Module } from '@nestjs/common';
import { VendorVoucherController } from './vendor-voucher.controller';
import { VendorVoucherService } from './vendor-voucher.service';
import { VendorVoucherRepository } from './vendor-voucher.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VendorVoucherController],
  providers: [VendorVoucherRepository, VendorVoucherService],
  exports: [VendorVoucherService],
})
export class VendorVoucherModule {}
