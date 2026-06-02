import { FeatureFlags } from '../entities/feature-flags.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toFeatureFlagsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toFeatureFlagsList(rows: any[]) {
  return rows.map(toFeatureFlagsResponse);
}