// Auto-generated entity for `webhook_logs` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface WebhookLogs {
  id: number;  // PK, autoincrement. BIGINT — high frequency append-only
  tenantId?: number;  // FK → masterdata_tenant.id
  webhookConfigId?: number;  // FK → masterdata_webhook_configs.id
  eventCode?: string;  // Event that triggered this call e.g. booking.created
  entityType?: string;  // Entity that generated the event e.g. booking, lr, invoice
  entityId?: number;  // PK of triggering entity
  attemptNumber?: number;  // 1 = first attempt, 2+ = retries
  parentLogId?: number;  // FK → webhook_logs.id. Points to attempt_number=1 row for retries
  url?: string;  // Actual URL called (may differ if config changed)
  method?: string;  // HTTP method used
  requestHeaders?: Record<string, any>;  // Headers sent (sensitive values redacted)
  requestPayload?: string;  // JSON/XML payload sent
  responseStatus?: number;  // HTTP status code received. NULL = network error
  responseBody?: string;  // Response body. Truncated at 16KB
  durationMs?: number;  // Round-trip latency in milliseconds
  isSuccess?: boolean;  // TRUE if status 2xx. FALSE on error/timeout
  errorMessage?: string;  // Network/timeout error message. NULL on success
  triggeredAt?: Date;  // When this attempt was made. Indexed
  nextRetryAt?: Date;  // Scheduled time for next retry. NULL if no retry planned
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
}
