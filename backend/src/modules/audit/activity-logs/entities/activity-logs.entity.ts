// Auto-generated entity for `activity_logs` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ActivityLogs {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  userId?: number;  // FK → masterdata_users.id — Who performed the action (changed_by in audit standards)
  action?: string;  // CREATE | UPDATE | DELETE | LOGIN | LOGOUT | APPROVE | REJECT | EXPORT | PRINT — Also serves as action_type field per ent
  tableName?: string;  // DB table affected — maps to entity_name in audit standards. e.g. masterdata_customer, booking_lr
  recordId?: number;  // PK of the affected row — maps to entity_id in audit standards
  oldValuesJson?: Record<string, any>;  // Complete snapshot of data BEFORE change
  newValuesJson?: Record<string, any>;  // Complete snapshot of data AFTER change
  ipAddress?: string;  // IPv4 or IPv6 address
  deviceInfo?: string;  // Device type: Mobile/Desktop/API
  browserInfo?: string;  // Browser and OS info
  sessionId?: string;  // Session correlation ID
  createdAt: Date;  // Event occurrence timestamp
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
