// Auto-generated entity for `api_sync_jobs` (25 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApiSyncJobs {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  integrationId?: number;  // FK → masterdata_api_integrations.id — which external system
  entityType?: string;  // Type of entity being synced. e.g. invoice, lr, ewaybill, vehicle
  entityId?: number;  // ID of the record being synced
  syncType?: string;  // Type of sync operation. e.g. SAP_INVOICE_POST, EWB_GENERATE, EWB_EXTEND, GPS_VEHICLE_UPDATE, FASTAG_TOPUP
  syncStatus?: string;  // Current status of sync job
  priority?: string;  // Job priority. URGENT: EWB expiry (legal compliance). HIGH: SAP invoice. NORMAL: GPS sync. LOW: reports.
  scheduledAt?: Date;  // When to execute. NULL = process immediately
  startedAt?: Date;  // When worker picked up this job
  completedAt?: Date;  // When job completed (success or permanent failure)
  requestPayload?: Record<string, any>;  // Full JSON payload sent to external API
  responsePayload?: Record<string, any>;  // Full JSON response received from external API
  httpStatusCode?: number;  // HTTP response code from external API. 200=success, 4xx=client error, 5xx=server error
  errorMessage?: string;  // Error details if sync failed
  retryCount?: number;  // Number of attempts made
  maxRetry?: number;  // Max retry limit for this job
  nextRetryAt?: Date;  // When to attempt next retry (exponential backoff)
  createdBy?: number;  // FK → masterdata_users.id (NULL for system-auto jobs)
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
