// Auto-generated entity for `feature_flags` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface FeatureFlags {
  id: number;  // PK, autoincrement
  featureKey?: string;  // Unique machine key e.g. module.fleet.gps_tracking. UNIQUE
  moduleName?: string;  // Grouping module e.g. Fleet, Finance, HR, Operations
  featureName?: string;  // Human display name e.g. GPS Live Tracking
  description?: string;  // What this feature controls
  featureType?: boolean;  // boolean=on/off, limit=max count, enum=tier selection
  defaultValue?: string;  // Default value if not overridden per tenant
  planRequired?: string;  // Minimum plan tier to enable this feature
  sortOrder?: number;  // Display ordering in admin UI
  active?: boolean;  // Soft-disable a feature without deleting. Default TRUE
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
