import { VendorVoucherItems } from '../entities/vendor-voucher-items.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVendorVoucherItemsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    voucherId: row.voucherId?.toString(),
    referenceId: row.referenceId?.toString(),
  };
}

export function toVendorVoucherItemsList(rows: any[]) {
  return rows.map(toVendorVoucherItemsResponse);
}