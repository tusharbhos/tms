// Auto-generated entity for `txn_vendor_voucher` (39 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface VendorVoucher {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  voucherNo?: string;  // Auto-generated from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  companyId?: number;  // FK → masterdata_company.id
  vendorId?: number;  // FK → masterdata_vendor.id — transport vendor being paid
  tripId?: number;  // FK → txn_trip.id — trip this voucher is for
  manifestId?: number;  // FK → txn_manifest.id
  voucherDate?: Date;  // Voucher creation date
  voucherType?: string;  // What this payment is for
  hireCharges?: number;  // Agreed trip hire charge
  advanceDeduction?: number;  // Advance already paid — deduct from final
  loadingCharges?: number;  // Loading charges at hub
  fuelDeduction?: number;  // Company-paid fuel — deduct from hire
  penaltyAmount?: number;  // Penalty for delay / shortage / damage
  penaltyRemarks?: string;  // Why penalty applied
  otherDeductions?: number;  // Miscellaneous deductions
  grossAmount?: number;  // hire_charges + loading (before deductions)
  netAmount?: number;  // Final amount to pay vendor
  gstApplicable?: boolean;  // Whether GST/TDS applies on vendor payment
  tdsRate?: number;  // TDS rate on transport payment (typically 1% or 2%)
  tdsAmount?: number;  // TDS amount deducted
  payableAmount?: number;  // Final payable = net_amount - tds_amount
  paymentMode?: string;  // How payment was made
  utrNumber?: string;  // Bank transaction reference — UTR/IMPS/UPI ID
  paidAt?: Date;  // When payment was made
  voucherStatus?: string;  // Voucher lifecycle
  approvedBy?: number;  // FK → masterdata_users.id — finance approver
  pdfUrl?: string;  // CDN URL of voucher PDF
  sapSyncStatus?: string;  // SAP AP (Accounts Payable) sync status. After voucher is PAID: push to SAP as vendor payment document. NOT_REQUIRED for n
  sapDocumentNo?: string;  // SAP payment document number (FI document) from SAP AP module. e.g. 1500001234. Required for: SAP-side payment reconcilia
  sapSyncError?: string;  // SAP error when sync fails. Common: vendor not in SAP master, bank details missing, cost center invalid.
  sapSyncedAt?: Date;  // Timestamp when vendor voucher was successfully posted to SAP AP module.
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
}

export const VendorVoucherStatuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "PAYMENT_INITIATED", "ON_HOLD", "PAID", "REJECTED"] as const;
export type VendorVoucherStatus = (typeof VendorVoucherStatuses)[number];

export const VendorVoucherTransitions: Record<string, string[]> = {
  "DRAFT": [
    "PENDING_APPROVAL"
  ],
  "PENDING_APPROVAL": [
    "APPROVED",
    "REJECTED",
    "ON_HOLD"
  ],
  "APPROVED": [
    "PAYMENT_INITIATED"
  ],
  "PAYMENT_INITIATED": [
    "PAID"
  ],
  "ON_HOLD": [
    "PENDING_APPROVAL"
  ],
  "PAID": [],
  "REJECTED": []
};
