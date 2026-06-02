import { ApiWebhookLogs } from '../entities/api-webhook-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApiWebhookLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
  };
}

export function toApiWebhookLogsList(rows: any[]) {
  return rows.map(toApiWebhookLogsResponse);
}