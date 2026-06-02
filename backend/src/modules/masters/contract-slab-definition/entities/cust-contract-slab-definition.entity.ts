// Auto-generated entity for `cust_contract_slab_definition` (27 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustContractSlabDefinition {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  custContractId?: number;  // FK → cust_contract. Mandatory
  ctrNum?: string;  // Contract number (denormalised from cust_contract)
  slabDistanceType?: Record<string, any>;  // PER_KM | POINT_TO_POINT | PINCODE_TO_PINCODE | ZONE_WISE | DIST_WISE | HUB_TO_HUB
  slabContractType?: string;  // PER_KG | PER_PKG
  slabRateType?: string;  // RATED | FLAT
  slabNumber?: string;  // Slab sequence: 1 through 8
  slabLowerLimit?: number;  // Weight slab lower bound. Mandatory
  slabUpperLimit?: number;  // Weight slab upper bound. Mandatory
  versionNo?: number;  // Version number. Starts at 1. Increments on each approved revision. Old versions remain for audit
  isCurrent?: boolean;  // TRUE = this is the active version. Only 1 can be TRUE per contract/rate entity
  supersededBy?: number;  // FK → same table. ID of the newer version that replaced this one. NULL if still current
  approvalStatus?: string;  // Lifecycle status. New rows start as draft
  approvedBy?: number;  // FK → masterdata_users.id. Who approved this version
  rejectionReason?: string;  // Reason for rejection if approval_status=rejected. Nullable
  effectiveFrom?: Date;  // Date from which this version is effective
  effectiveUntil?: Date;  // Date until which this version is valid. NULL = indefinite
  changeSummary?: string;  // Human-readable description of what changed in this version
  previousVersionId?: number;  // FK → same table. ID of the version this was revised from. NULL for v1
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
