import { Module } from '@nestjs/common';
import { VendorVoucherItemsController } from './vendor-voucher-items.controller';
import { VendorVoucherItemsService } from './vendor-voucher-items.service';
import { VendorVoucherItemsRepository } from './vendor-voucher-items.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VendorVoucherItemsController],
  providers: [VendorVoucherItemsRepository, VendorVoucherItemsService],
  exports: [VendorVoucherItemsService],
})
export class VendorVoucherItemsModule {}
