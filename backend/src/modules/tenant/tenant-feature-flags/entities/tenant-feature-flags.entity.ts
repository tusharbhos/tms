// Auto-generated entity for `tenant_feature_flags` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TenantFeatureFlags {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  featureFlagId?: number;  // FK → masterdata_feature_flags.id
  featureKey?: string;  // Denormalised key for fast lookup without JOIN
  enabled?: boolean;  // TRUE = feature is ON for this tenant. Default FALSE
  limitValue?: number;  // If feature_type=limit: max allowed count. NULL = unlimited
  overrideValue?: string;  // Custom enum/value override for this tenant
  validFrom?: Date;  // Feature active from this date. NULL = always
  validUntil?: Date;  // Feature expires on this date. NULL = no expiry
  notes?: string;  // Internal notes e.g. "Trial — convert by 2025-12-31"
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
