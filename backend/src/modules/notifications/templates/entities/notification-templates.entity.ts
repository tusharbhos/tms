// Auto-generated entity for `notification_templates` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface NotificationTemplates {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = system-global template
  eventCode?: string;  // Machine event key e.g. booking.created, payment.overdue, lr.dispatched. Unique per tenant+channel+lang
  eventName?: string;  // Human label e.g. Booking Confirmation, Payment Due Alert
  channel?: string;  // Delivery channel
  languageCode?: string;  // Language of this template e.g. en, hi, mr. Default en
  subject?: string;  // Email subject line. NULL for SMS/WhatsApp
  body?: string;  // Template body with {{variable}} placeholders e.g. Dear {{customer_name}}, your LR {{lr_no}} is dispatched
  bodyHtml?: string;  // HTML version of body for email. NULL for SMS/WhatsApp
  variables?: Record<string, any>;  // List of expected variables: ["customer_name","lr_no","amount"]. For validation
  senderId?: string;  // DLT-registered sender ID / From address. e.g. TMSTMS
  dltTemplateId?: string;  // TRAI DLT template ID (mandatory for commercial SMS in India)
  provider?: number;  // Gateway/provider for this channel
  category?: string;  // Message category for DLT compliance
  isActive?: boolean;  // FALSE = template disabled, events use fallback. Default TRUE
  version?: number;  // Template version. Increment on edit. Older versions archived
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
