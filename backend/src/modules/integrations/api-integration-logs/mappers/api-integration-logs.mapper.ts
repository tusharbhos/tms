import { ApiIntegrationLogs } from '../entities/api-integration-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApiIntegrationLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toApiIntegrationLogsList(rows: any[]) {
  return rows.map(toApiIntegrationLogsResponse);
}