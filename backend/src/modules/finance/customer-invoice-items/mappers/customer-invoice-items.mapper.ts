import { CustomerInvoiceItems } from '../entities/customer-invoice-items.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustomerInvoiceItemsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    invoiceId: row.invoiceId?.toString(),
    lrId: row.lrId?.toString(),
    podId: row.podId?.toString(),
  };
}

export function toCustomerInvoiceItemsList(rows: any[]) {
  return rows.map(toCustomerInvoiceItemsResponse);
}