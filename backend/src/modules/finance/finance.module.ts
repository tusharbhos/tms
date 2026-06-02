import { CustomerInvoiceModule } from './customer-invoice/customer-invoice.module';
import { CustomerInvoiceItemsModule } from './customer-invoice-items/customer-invoice-items.module';
import { VendorVoucherModule } from './vendor-voucher/vendor-voucher.module';
import { VendorVoucherItemsModule } from './vendor-voucher-items/vendor-voucher-items.module';
import { FuelLogModule } from './fuel-log/fuel-log.module';
import { LoaderExpenseModule } from './loader-expense/loader-expense.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CustomerInvoiceModule,
    CustomerInvoiceItemsModule,
    VendorVoucherModule,
    VendorVoucherItemsModule,
    FuelLogModule,
    LoaderExpenseModule
  ],
})
export class FinanceModule {}
