// Auto-generated entity for `driver_rate` (41 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DriverRate {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  contractingOfficeId?: number;  // FK → office
  vendorId?: number;  // FK → vendor/driver
  vendorName?: string;  // Driver name (denormalised)
  defaultRateType?: string;  // HOURLY | BY_KM | DAILY | TRIP_WISE | MONTHLY | ALL
  dailyRate?: number;  // Fixed daily rate
  hourlyRate?: number;  // Hourly rate
  overtimeHourlyRate?: number;  // OT rate per hour
  dailyAllowance?: number;  // Daily allowance
  perKmRate?: number;  // Rate per km
  perExtraKmRate?: number;  // Rate per km beyond standard distance
  nightHaltRate?: number;  // Per night halt allowance
  perTripRate?: number;  // Fixed per-trip rate
  tripAllowance?: number;  // Per-trip allowance/bonus
  incentivePerTrip?: number;  // Performance incentive per trip
  monthlySal?: number;  // Fixed monthly salary
  monthlyIncentive?: number;  // Monthly incentive on top of salary
  perTripPenaltyPercent?: number;  // Penalty % for delayed/damaged trips
  perTripPenaltyFixedAmount?: number;  // Fixed penalty per violation
  startDate?: Date;  // Rate card start date. Mandatory
  endDate?: Date;  // Rate card end date. Mandatory
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
