// Auto-generated entity for `api_integration_logs` (25 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApiIntegrationLogs {
  id: number;  // PK, autoincrement. BIGINT — very high frequency
  tenantId?: number;  // FK → masterdata_tenant.id
  integrationId?: number;  // FK → masterdata_api_integrations.id
  direction?: string;  // outbound=TMS calling third-party, inbound=webhook received
  method?: string;  // HTTP method used
  requestUrl?: string;  // Full URL called (sanitised — no tokens in URL)
  requestHeaders?: Record<string, any>;  // Request headers (sensitive values redacted)
  requestPayload?: string;  // Request body JSON/XML. PII masked per policy
  responsePayload?: string;  // Response body. Truncated at 64KB if larger
  statusCode?: number;  // HTTP response status code e.g. 200, 400, 500
  durationMs?: number;  // Round-trip latency in milliseconds
  errorMessage?: string;  // Error description if call failed. NULL on success
  errorCode?: string;  // Provider-specific error code. Nullable
  retryCount?: number;  // Number of retries attempted. 0 = first attempt
  isSuccess?: boolean;  // TRUE if status_code 2xx and no error
  entityType?: string;  // Context: which entity triggered this call. Nullable
  entityId?: number;  // ID of triggering entity. Nullable
  calledAt?: Date;  // When call was initiated. Indexed
  respondedAt?: Date;  // When response was received
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
