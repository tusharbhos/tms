import { VendorKyc } from '../entities/vendor-kyc.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVendorKycResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toVendorKycList(rows: any[]) {
  return rows.map(toVendorKycResponse);
}