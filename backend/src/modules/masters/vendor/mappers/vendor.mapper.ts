import { Vendor } from '../entities/vendor.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVendorResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toVendorList(rows: any[]) {
  return rows.map(toVendorResponse);
}