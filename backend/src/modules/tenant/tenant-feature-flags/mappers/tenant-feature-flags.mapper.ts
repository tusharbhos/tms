import { TenantFeatureFlags } from '../entities/tenant-feature-flags.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTenantFeatureFlagsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toTenantFeatureFlagsList(rows: any[]) {
  return rows.map(toTenantFeatureFlagsResponse);
}