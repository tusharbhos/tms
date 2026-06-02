import { ApiProviderConfig } from '../entities/api-provider-config.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApiProviderConfigResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toApiProviderConfigList(rows: any[]) {
  return rows.map(toApiProviderConfigResponse);
}