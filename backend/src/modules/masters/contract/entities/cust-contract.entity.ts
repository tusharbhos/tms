// Auto-generated entity for `cust_contract` (40 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustContract {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → tenant
  companyTag?: number;  // FK → company
  customerId?: number;  // FK → customer. Mandatory
  customerGroupId?: number;  // FK → customer (group account)
  ctrNum?: string;  // UNIQUE contract number per tenant
  startDate?: Date;  // Contract effective from. Mandatory
  endDate?: Date;  // Contract expiry. Mandatory
  paymentType?: Record<string, any>;  // TBB | PRE-PAID | POD | COD
  loadType?: Record<string, any>;  // FTL | PTL | SL
  distanceType?: Record<string, any>;  // PER_KM | POINT_TO_POINT | PINCODE_TO_PINCODE | ZONE_WISE | DIST_WISE | TALUKA_WISE | HUB_TO_HUB
  rateType?: Record<string, any>;  // PER_KG | PER_PKG
  pickupDeliveryMode?: Record<string, any>;  // DoorPickupDoorDelivery | DoorPickupGodownDelivery | GodownPickupDoorDelivery | GodownPickupGodownDelivery
  excessWtChargeable?: boolean;  // Default TRUE
  odaDelChargeable?: boolean;  // Default TRUE
  creditPeriod?: number;  // Default 15 days
  docuChargesPerInvoice?: number;  // Documentation charges per invoice. Default 0
  loadingChargesPerPkg?: number;  // Loading charges per package. Default 0
  fuelSurcharge?: number;  // Fuel surcharge %. Default 0
  odaMinDelCharges?: number;  // Minimum ODA delivery charges. Default 0
  reversePickUpCharges?: number;  // Reverse pickup charges. Default 0
  insuranceCharges?: number;  // Insurance charges. Default 0
  minimumChargeableWt?: number;  // Minimum chargeable weight. Default 0
  active?: boolean;  // Default FALSE (requires approval)
  versionNo?: number;  // Version number. Starts at 1. Increments on each approved revision. Old versions remain for audit
  isCurrent?: boolean;  // TRUE = this is the active version. Only 1 can be TRUE per contract/rate entity
  supersededBy?: number;  // FK → same table. ID of the newer version that replaced this one. NULL if still current
  approvalStatus?: string;  // Lifecycle status. New rows start as draft
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
