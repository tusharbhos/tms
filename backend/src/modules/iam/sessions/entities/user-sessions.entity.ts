// Auto-generated entity for `user_sessions` (23 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface UserSessions {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  userId?: number;  // FK → masterdata_users.id
  sessionTokenHash?: string;  // SHA-256 hash of session token. Never store raw token
  ipAddress?: string;  // Client IP at login. Supports IPv6
  userAgent?: string;  // Full browser/app User-Agent string
  deviceType?: string;  // Device category
  deviceInfo?: string;  // Parsed device details: OS, browser, version
  locationCity?: string;  // GeoIP city at login. Nullable
  locationCountry?: string;  // GeoIP country at login. Nullable
  locationLat?: number;  // GeoIP latitude. Nullable
  locationLng?: number;  // GeoIP longitude. Nullable
  sessionStartedAt?: Date;  // Login timestamp
  lastActiveAt?: Date;  // Last API call timestamp. Updated on activity
  sessionEndedAt?: Date;  // Logout/expiry timestamp. NULL = still active
  endReason?: Date;  // Why session ended. NULL if still active
  isActive?: boolean;  // TRUE = live session. FALSE = ended
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
