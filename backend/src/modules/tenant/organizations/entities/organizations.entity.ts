// Auto-generated entity for `organizations` (18 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Organizations {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  parentOrganizationId?: number;  // Self-referencing FK → masterdata_organizations.id. NULL = root org
  orgCode?: string;  // Unique short code e.g. TATA-GRP. Used in reports
  orgName?: string;  // Full organisation display name
  orgNameReg?: string;  // Org name in regional language. Nullable
  orgType?: string;  // Legal/structural type of organisation
  description?: string;  // Optional description / notes
  logoUrl?: string;  // Org logo. Nullable
  country?: string;  // Primary country of operation
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
