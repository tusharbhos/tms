// Auto-generated entity for `txn_booking_charges` (38 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface BookingCharges {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  bookingId?: number;  // FK → txn_booking.id
  lrId?: number;  // FK → txn_lr.id — Set when LR generated
  contractId?: number;  // FK → masterdata_cust_contract.id — Rate source
  rateType?: string;  // How freight rate is applied
  freightRatePerKg?: number;  // Rate per KG from contract slab
  freightRatePerPkg?: number;  // Rate per package from contract
  chargeableWeight?: number;  // max(actual_weight, vol_weight) — used for freight calc
  freightCharges?: number;  // Base freight amount
  excessWeightCharges?: number;  // Surcharge for weight above slab limit
  loadingCharges?: number;  // Loading/unloading charge from contract or master
  doorDeliveryCharges?: number;  // Door delivery surcharge — if delivery_type=DOOR
  odaCharges?: number;  // Out-of-Delivery-Area surcharge
  insuranceRatePct?: number;  // Insurance rate percentage of invoice value
  insuranceAmount?: number;  // Calculated insurance charge
  fuelSurcharge?: number;  // Fuel surcharge — based on current fuel_surcharge_pct from tenant config
  codCharges?: number;  // COD collection charge — applicable if payment_type=COD
  otherCharges?: number;  // Miscellaneous charges
  otherChargesRemarks?: string;  // Reason for other charges
  subTotal?: number;  // Total before GST
  sgstRate?: number;  // SGST rate — applicable if origin/destination same state
  cgstRate?: number;  // CGST rate — same-state only
  igstRate?: number;  // IGST rate — applicable if origin/destination different state
  sgstAmount?: number;  // SGST amount = sub_total × sgst_rate / 100
  cgstAmount?: number;  // CGST amount
  igstAmount?: number;  // IGST amount
  totalCharges?: number;  // Grand total including GST
  advanceAmount?: number;  // Advance payment collected at booking
  balanceAmount?: number;  // Remaining balance = total_charges - advance_amount
  isLocked?: boolean;  // TRUE = charges locked (LR printed, cannot change)
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
