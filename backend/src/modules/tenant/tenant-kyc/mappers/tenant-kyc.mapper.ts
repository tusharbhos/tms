import { TenantKyc } from '../entities/tenant-kyc.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTenantKycResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toTenantKycList(rows: any[]) {
  return rows.map(toTenantKycResponse);
}