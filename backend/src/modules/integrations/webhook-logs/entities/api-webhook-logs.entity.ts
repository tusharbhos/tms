// Auto-generated entity for `txn_api_webhook_logs` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApiWebhookLogs {
  id: number;  // PK — Auto-increment.
  uuid?: string;  // External-safe UUID. Used in webhook callback URLs.
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory isolation key.
  apiName?: string;  // Name of API integration. e.g. NIC_EWAYBILL, SAP_INVOICE, MSG91_SMS, GPS_WEBHOOK, WHATSAPP_DLR.
  direction?: string;  // OUTBOUND = we called external API. INBOUND = external system called us (webhook/callback).
  entityType?: string;  // Which entity this call relates to. lr, booking, trip, invoice, notification.
  entityId?: number;  // ID of the related entity (lr_id, booking_id, invoice_id etc.)
  httpMethod?: string;  // HTTP method used in the API call.
  endpointUrl?: string;  // Full API endpoint URL called or received on.
  requestPayload?: Record<string, any>;  // Full request body sent to / received from external API.
  responsePayload?: Record<string, any>;  // Full response received from external API.
  statusCode?: number;  // HTTP status code of the API response. 200, 201, 400, 500 etc.
  callStatus?: string;  // Business-level status of the API call.
  errorMessage?: string;  // Parsed error message from provider if call failed.
  retryCount?: number;  // Number of retry attempts made so far.
  maxRetry?: number;  // Maximum retry attempts allowed for this api_name.
  nextRetryAt?: Date;  // Scheduled time for next retry attempt.
  durationMs?: number;  // API call response time in milliseconds. Used for SLA monitoring.
  createdBy?: number;  // FK → masterdata_users.id — Who triggered this API call (user or SYSTEM).
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP.
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP.
}
