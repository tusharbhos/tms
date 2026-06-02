// Auto-generated entity for `status_automation_rules` (17 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface StatusAutomationRules {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = global platform rule
  ruleName?: string;  // Human-readable rule name. e.g. 'Manifest Load → IN_TRANSIT'
  triggerEvent?: string;  // The business event that fires this rule
  targetEntity?: string;  // Which entity gets the status update
  targetStatus?: string;  // Status code to set on target entity. e.g. IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, HUB_RECEIVED
  conditionJson?: Record<string, any>;  // Optional conditions that must be true for rule to fire. e.g. {"all_lrs_loaded":true} or {"payment_type":"TOPAY"}
  autoNotifyCustomer?: boolean;  // TRUE = send customer notification when rule fires
  notificationEventCode?: string;  // Event code for notification. e.g. LR_IN_TRANSIT, LR_OFD, LR_DELIVERED
  createLrStateLog?: boolean;  // TRUE = insert row in txn_lr_state_log on trigger
  isActive?: boolean;  // Enable/disable this rule
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
