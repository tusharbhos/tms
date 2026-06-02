// Auto-generated entity for `txn_customer_invoice` (36 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustomerInvoice {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  invoiceNo?: string;  // Auto-generated invoice number from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  companyId?: number;  // FK → masterdata_company.id — billing company
  billingOfficeId?: number;  // FK → masterdata_office.id — billing branch
  customerId?: number;  // FK → masterdata_customer.id — who gets invoice
  invoiceType?: string;  // GST invoice type
  invoiceDate?: Date;  // Invoice date
  dueDate?: Date;  // Payment due date = invoice_date + credit_days
  periodFrom?: Date;  // Billing period start — for consolidated period invoices
  periodTo?: Date;  // Billing period end
  numLrs?: number;  // Number of LRs in this invoice
  subTotal?: number;  // Total before GST
  totalSgst?: number;  // Total SGST
  totalCgst?: number;  // Total CGST
  totalIgst?: number;  // Total IGST
  grandTotal?: number;  // Invoice total including GST
  tdsRate?: number;  // TDS deduction rate if applicable
  tdsAmount?: number;  // TDS amount to be deducted
  invoiceStatus?: string;  // Invoice lifecycle
  paymentReceived?: number;  // Amount received so far
  pdfUrl?: string;  // CDN URL of generated invoice PDF
  emailSentAt?: Date;  // When invoice email was sent to customer
  isGstInvoice?: boolean;  // TRUE = GST tax invoice with GSTIN
  referenceInvoiceId?: number;  // FK → self — for credit/debit notes: original invoice
  sapSyncStatus?: string;  // SAP/ERP synchronization status. NOT_REQUIRED for tenants without SAP. PENDING: invoice generated, waiting for SAP push. 
  sapDocumentNo?: string;  // SAP billing document number returned by SAP API after successful sync. e.g. 9000012345. Used for: reconciliation, SAP-si
  sapSyncError?: string;  // SAP API error message when sap_sync_status=FAILED. Store raw error for debugging. Common: customer not in SAP, GL accoun
  sapSyncedAt?: Date;  // Timestamp when invoice was successfully synced to SAP. Used to track SAP posting delay.
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
}

export const CustomerInvoiceStatuses = ["DRAFT", "ISSUED", "SENT", "ACKNOWLEDGED", "PARTIAL_PAID", "DISPUTED", "RESOLVED", "PAID", "WRITTEN_OFF"] as const;
export type CustomerInvoiceStatus = (typeof CustomerInvoiceStatuses)[number];

export const CustomerInvoiceTransitions: Record<string, string[]> = {
  "DRAFT": [
    "ISSUED"
  ],
  "ISSUED": [
    "SENT"
  ],
  "SENT": [
    "ACKNOWLEDGED",
    "WRITTEN_OFF"
  ],
  "ACKNOWLEDGED": [
    "PARTIAL_PAID",
    "PAID",
    "DISPUTED"
  ],
  "PARTIAL_PAID": [
    "PAID"
  ],
  "DISPUTED": [
    "RESOLVED"
  ],
  "RESOLVED": [
    "PAID"
  ],
  "PAID": [],
  "WRITTEN_OFF": []
};
