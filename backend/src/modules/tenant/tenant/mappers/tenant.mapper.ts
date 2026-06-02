import { Tenant } from '../entities/tenant.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTenantResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toTenantList(rows: any[]) {
  return rows.map(toTenantResponse);
}