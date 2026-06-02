// Auto-generated entity for `login_attempts` (20 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface LoginAttempts {
  id: number;  // PK, autoincrement. BIGINT — high frequency table
  tenantId?: number;  // FK → masterdata_tenant.id. NULL for invalid tenant attempts
  userId?: number;  // FK → masterdata_users.id. NULL if username not found
  loginIdentifier?: string;  // Username/email/mobile entered. Stored for investigation
  attemptedAt?: Date;  // Exact timestamp of attempt. Indexed
  ipAddress?: string;  // Client IP. IPv4/IPv6
  userAgent?: string;  // Browser/device User-Agent
  deviceInfo?: string;  // Parsed device info
  loginStatus?: string;  // Outcome of this attempt
  failedReason?: string;  // Specific failure reason. NULL on success
  locationCity?: string;  // GeoIP city. Nullable
  locationCountry?: string;  // GeoIP country. Nullable
  sessionId?: number;  // FK → user_sessions.id. Set on successful login only
  isSuspicious?: boolean;  // Flagged by anomaly detection (new country, odd hour etc.)
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
