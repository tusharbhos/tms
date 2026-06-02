// Auto-generated entity for `loader_rate` (37 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface LoaderRate {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  contractingOfficeId?: number;  // FK → office. Branch that contracted this loader
  vendorId?: number;  // FK → vendor. Mandatory
  vendorName?: string;  // Loader vendor name (denormalised for speed)
  defaultRateType?: string;  // PKG_WT | DAILY | MONTHLY | ALL
  regPkgRate?: number;  // Regular consignment per-package rate
  crossingPkgRate?: number;  // Crossing (long distance) per-package rate
  regWeightRate?: number;  // Regular per-kg rate
  crossingWeightRate?: number;  // Crossing per-kg rate
  monthlySal?: number;  // Monthly fixed salary
  dailyAllowance?: number;  // Daily allowance amount
  dailyWage?: number;  // Daily wage rate
  dailyWagePkgCapping?: number;  // Max packages in one daily wage
  dailyWageWeightCapping?: number;  // Max weight in one daily wage
  overtimeHourlyRate?: number;  // OT rate per hour beyond standard shift
  startDate?: Date;  // Rate card effective from. Mandatory
  endDate?: Date;  // Rate card valid till. Mandatory
  active?: boolean;  // Default TRUE
  status?: string;  // CREATED | APPROVED | REJECTED | PENDING_UPDATE | PENDING_APPROVAL
  note?: string;  // Notes
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
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
