import { WebhookConfigs } from '../entities/webhook-configs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toWebhookConfigsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toWebhookConfigsList(rows: any[]) {
  return rows.map(toWebhookConfigsResponse);
}