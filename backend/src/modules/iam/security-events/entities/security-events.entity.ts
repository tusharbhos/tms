// Auto-generated entity for `security_events` (23 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface SecurityEvents {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  userId?: number;  // FK → masterdata_users.id. Affected user
  eventType?: string;  // Category of security event
  severity?: string;  // Risk severity level
  description?: string;  // Human-readable description of what happened
  ipAddress?: string;  // IP address associated with event
  userAgent?: string;  // Device/browser info
  locationCity?: string;  // GeoIP city. Nullable
  locationCountry?: string;  // GeoIP country. Nullable
  triggeredBy?: number;  // FK → masterdata_users.id. Admin who triggered. NULL=automated
  relatedLoginAttemptId?: number;  // FK → login_attempts.id. Link to triggering attempt
  eventAt?: Date;  // When event occurred. Indexed
  resolvedAt?: Date;  // When event was resolved/acknowledged. NULL = open
  resolvedBy?: number;  // FK → masterdata_users.id. Admin who resolved
  resolutionNotes?: string;  // Admin notes on resolution
  metadata?: Record<string, any>;  // Any extra context (old_role, new_role, affected_records etc.)
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
