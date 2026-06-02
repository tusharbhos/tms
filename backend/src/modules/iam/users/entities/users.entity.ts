// Auto-generated entity for `users` (39 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Users {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant. Nullable (NULL = SYSTEM user)
  roleId?: number;  // FK → role. Determines permissions
  uuid?: string;  // UNIQUE — Public-safe external ID for API responses
  employeeCode?: string;  // HR system employee code for integration
  name?: string;  // Full name. Mandatory
  loginId?: string;  // Login username. Unique per tenant. e.g. raj.sharma
  userType?: string;  // TENANT | SYSTEM
  profilePicUrl?: string;  // Avatar URL
  jobTitle?: string;  // Designation e.g. Branch Manager, Operator
  designation?: string;  // Full designation title for display
  department?: string;  // Department name (simple text for quick ref)
  departmentId?: number;  // FK → departments table (structured ref)
  mobile?: string;  // Mandatory. Unique per tenant
  email?: string;  // Primary email. Unique per tenant
  email2?: string;  // Secondary email for CC/backup
  passwordHash?: string;  // bcrypt hash. Mandatory
  googleId?: string;  // Google OAuth ID. Nullable
  ssoId?: string;  // SSO provider user ID
  ssoRef?: string;  // SSO reference (which provider)
  aadhaar?: string;  // Employee Aadhaar. Encrypted at rest
  pan?: string;  // Employee PAN. Encrypted at rest
  epfUan?: string;  // EPF Universal Account Number
  epfNum?: string;  // EPF member number
  esic?: string;  // ESIC insurance number
  officeId?: number;  // FK → office. User's assigned branch
  managerUserId?: number;  // Self FK → users. Reporting manager (org chart)
  lastLogin?: Date;  // Last successful login timestamp
  lastPasswordReset?: Date;  // Last password change timestamp
  failedLoginAttempts?: number;  // Default 0. Lock after N failures
  active?: boolean;  // Default TRUE
  status?: string;  // Replaces boolean active
  remarks?: string;  // Internal notes about user
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who performed soft-delete
}
