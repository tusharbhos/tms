// Auto-generated entity for `user_otps` (13 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface UserOtps {
  userId?: number;  // PK + FK → users. One row per user
  tenantId?: number;  // FK → tenant
  loginId?: string;  // Populated from users.login_id
  otpHash?: string;  // Hashed OTP value. Mandatory
  expiresAt?: Date;  // OTP validity window. Nullable
  failedOtpLoginAttempts?: number;  // Default 0
  otpLoginBlockedTill?: Date;  // Block OTP login till this time after N failures
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
