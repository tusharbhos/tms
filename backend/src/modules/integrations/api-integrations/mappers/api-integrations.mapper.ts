import { ApiIntegrations } from '../entities/api-integrations.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApiIntegrationsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toApiIntegrationsList(rows: any[]) {
  return rows.map(toApiIntegrationsResponse);
}