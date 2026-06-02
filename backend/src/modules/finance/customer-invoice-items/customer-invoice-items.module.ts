import { Module } from '@nestjs/common';
import { CustomerInvoiceItemsController } from './customer-invoice-items.controller';
import { CustomerInvoiceItemsService } from './customer-invoice-items.service';
import { CustomerInvoiceItemsRepository } from './customer-invoice-items.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerInvoiceItemsController],
  providers: [CustomerInvoiceItemsRepository, CustomerInvoiceItemsService],
  exports: [CustomerInvoiceItemsService],
})
export class CustomerInvoiceItemsModule {}
