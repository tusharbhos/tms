import { Module } from '@nestjs/common';
import { CustomerInvoiceController } from './customer-invoice.controller';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CustomerInvoiceRepository } from './customer-invoice.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerInvoiceController],
  providers: [CustomerInvoiceRepository, CustomerInvoiceService],
  exports: [CustomerInvoiceService],
})
export class CustomerInvoiceModule {}
