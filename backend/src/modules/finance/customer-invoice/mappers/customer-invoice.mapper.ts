import { CustomerInvoice } from '../entities/customer-invoice.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustomerInvoiceResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    referenceInvoiceId: row.referenceInvoiceId?.toString(),
  };
}

export function toCustomerInvoiceList(rows: any[]) {
  return rows.map(toCustomerInvoiceResponse);
}