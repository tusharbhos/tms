// Auto-generated entity for `txn_notification_queue` (28 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface NotificationQueue {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  eventCode?: string;  // Trigger event. e.g. BOOKING_CONFIRMED, LR_GENERATED, OFD, DELIVERED
  entityType?: string;  // Type of entity: booking, lr, trip, pod, invoice
  entityId?: number;  // ID of the entity that triggered notification
  channel?: string;  // Notification channel
  templateId?: number;  // FK → masterdata_notification_templates.id
  recipientMobile?: string;  // Target mobile number — with country code
  recipientEmail?: string;  // Target email address
  message?: string;  // Rendered message — template + variables merged
  variablesJson?: Record<string, any>;  // Dynamic variables used in template
  status?: string;  // Notification status
  provider?: string;  // SMS/WhatsApp provider: MSG91, Twilio, Gupshup, etc.
  providerMsgId?: string;  // Provider-assigned message ID — for delivery receipt tracking
  retryCount?: number;  // Number of send attempts
  scheduledAt?: Date;  // When to send — for delayed notifications
  sentAt?: Date;  // When actually sent by provider
  errorMessage?: string;  // Provider error if FAILED
  createdAt: Date;  // Auto by DB
  maxRetry?: number;  // Maximum retry attempts before permanently marking FAILED. URGENT=5, HIGH=3, NORMAL=3, LOW=1. After max: create txn_excep
  nextRetryAt?: Date;  // When to attempt next send (exponential backoff). 1st retry: +1min. 2nd: +5min. 3rd: +30min. 4th: +2hr. 5th: +24hr.
  webhookRequired?: boolean;  // Whether a delivery receipt (DLR) webhook callback is expected from provider. TRUE: track in webhook_configs/logs. FALSE:
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP. When queue row was last updated.
  deletedAt?: Date;  // Soft-delete timestamp. NULL = active notification. Set to prune old records.
  deletedBy?: number;  // FK → masterdata_users.id — who soft-deleted (admin cleanup).
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
}
