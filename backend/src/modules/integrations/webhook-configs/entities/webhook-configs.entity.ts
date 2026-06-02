// Auto-generated entity for `webhook_configs` (26 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface WebhookConfigs {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  name?: string;  // Display name e.g. "SAP ERP - Booking Events"
  description?: string;  // Purpose of this webhook. Internal note
  url?: string;  // HTTPS endpoint URL. Must be HTTPS
  method?: string;  // HTTP method. POST recommended. Default POST
  authType?: string;  // Authentication method for the endpoint
  authConfig?: Record<string, any>;  // Auth credentials/config. Encrypted. e.g. {token: "...", header: "Authorization"}
  customHeaders?: Record<string, any>;  // Additional HTTP headers to send. Nullable
  events?: Record<string, any>;  // Array of event codes this webhook subscribes to. e.g. ["booking.created","lr.dispatched"]
  payloadFormat?: Record<string, any>;  // Payload format. Default json
  payloadTemplate?: string;  // Custom payload template with {{variables}}. NULL = default TMS payload
  timeoutSeconds?: number;  // Request timeout. Default 30 seconds
  maxRetries?: number;  // Max retry attempts on failure. Default 3
  retryDelaySeconds?: number;  // Delay between retries. Default 60 seconds
  signingSecret?: string;  // HMAC signing secret for payload signature. Encrypted
  isActive?: boolean;  // FALSE = webhook disabled. Default TRUE
  lastTriggeredAt?: Date;  // Last time this webhook was triggered. Updated on each call
  lastStatus?: string;  // Outcome of last call. Quick-glance health indicator
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
