// Auto-generated entity for `cust_contract_slab_rates` (37 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustContractSlabRates {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  custContractId?: number;  // FK → cust_contract
  ctrNum?: string;  // Contract number (denormalised)
  zone?: string;  // Zone code if zone-based pricing
  fromPlaceId?: number;  // FK → station_coverage (origin)
  fromPlace?: string;  // Origin station name. Mandatory
  toPlaceId?: number;  // FK → station_coverage (destination)
  toPlace?: string;  // Destination station name. Mandatory
  tat?: number;  // Transit time in days for this lane
  slabDistanceType?: Record<string, any>;  // Pricing logic type for this lane
  slabContractType?: string;  // PER_KG | PER_PKG
  slab1?: number;  // Rate for slab 1 (lowest weight). Default 0
  slab2?: number;  // Rate for slab 2. Default 0
  slab3?: number;  // Rate for slab 3. Default 0
  slab4?: number;  // Rate for slab 4. Default 0
  slab5?: number;  // Rate for slab 5. Default 0
  slab6?: number;  // Rate for slab 6. Default 0
  slab7?: number;  // Rate for slab 7. Default 0
  slab8?: number;  // Rate for slab 8 (highest weight). Default 0
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
