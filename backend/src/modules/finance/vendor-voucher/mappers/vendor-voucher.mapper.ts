import { VendorVoucher } from '../entities/vendor-voucher.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVendorVoucherResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
    manifestId: row.manifestId?.toString(),
  };
}

export function toVendorVoucherList(rows: any[]) {
  return rows.map(toVendorVoucherResponse);
}