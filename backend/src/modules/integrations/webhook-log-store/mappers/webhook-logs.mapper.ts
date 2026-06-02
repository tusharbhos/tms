import { WebhookLogs } from '../entities/webhook-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toWebhookLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    parentLogId: row.parentLogId?.toString(),
  };
}

export function toWebhookLogsList(rows: any[]) {
  return rows.map(toWebhookLogsResponse);
}