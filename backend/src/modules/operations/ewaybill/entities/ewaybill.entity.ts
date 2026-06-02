// Auto-generated entity for `txn_ewaybill` (30 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Ewaybill {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  lrId?: number;  // FK → txn_lr.id
  bookingId?: number;  // FK → txn_booking.id
  ewbNo?: string;  // E-way bill number from GST portal
  ewbDate?: Date;  // Date of e-way bill generation
  ewbValidTill?: Date;  // Expiry date — based on distance
  ewbType?: string;  // E-way bill type
  supplyType?: string;  // Direction of supply
  gstinSupplier?: string;  // Supplier (consignor) GSTIN
  gstinRecipient?: string;  // Recipient (consignee) GSTIN
  placeOfSupply?: string;  // State of supply for GST determination
  totalValue?: number;  // Total invoice value of goods
  hsnCode?: string;  // Primary HSN code for goods
  transporterId?: string;  // GSTIN of transporting company — registered on GST portal
  vehicleNo?: string;  // Vehicle number — filled when trip starts (Part B)
  vehicleType?: string;  // Vehicle category for EWB
  ewbStatus?: string;  // Status of e-way bill
  generationMode?: string;  // How EWB was generated
  cancelReason?: string;  // Reason if cancelled — required for GST portal
  apiRequestJson?: Record<string, any>;  // Raw API request sent to GST portal
  apiResponseJson?: Record<string, any>;  // Raw API response from GST portal
  consolidatedEwbNo?: string;  // Consolidated e-way bill number for multi-LR manifest
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
