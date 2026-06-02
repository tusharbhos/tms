// Auto-generated entity for `txn_customer_invoice_items` (27 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustomerInvoiceItems {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  invoiceId?: number;  // FK → txn_customer_invoice.id
  lrId?: number;  // FK → txn_lr.id — LR this line refers to
  podId?: number;  // FK → txn_pod.id — POD that triggered this line
  lrNo?: string;  // Snapshot LR number — for invoice line display
  lrDate?: Date;  // LR date — billing period reference
  fromPlace?: string;  // Origin hub/city snapshot
  toPlace?: string;  // Destination hub/city snapshot
  numPackages?: number;  // Packages delivered
  weightKg?: number;  // Chargeable weight
  freightCharges?: number;  // Base freight for this LR
  otherCharges?: number;  // Loading, ODA, door delivery, insurance etc.
  totalCharges?: number;  // Total before GST for this LR
  sgstRate?: number;  // SGST rate for this LR
  cgstRate?: number;  // CGST rate
  igstRate?: number;  // IGST rate
  sgstAmount?: number;  // SGST amount
  cgstAmount?: number;  // CGST amount
  igstAmount?: number;  // IGST amount
  lineTotal?: number;  // Line total including GST
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
