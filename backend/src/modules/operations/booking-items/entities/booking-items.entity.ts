// Auto-generated entity for `txn_booking_items` (31 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface BookingItems {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  bookingId?: number;  // FK → txn_booking.id
  lrId?: number;  // FK → txn_lr.id — Set when LR generated from this booking
  itemSeq?: number;  // Line item sequence 1,2,3... per booking
  invoiceNo?: string;  // Customer commercial invoice number
  invoiceDate?: Date;  // Date of customer invoice
  invoiceValue?: number;  // Commercial value of goods — for insurance + e-way bill
  goodsDesc?: string;  // Description of goods — print on LR + e-way bill
  hsnCode?: string;  // HSN/SAC code — for GST + e-way bill
  numPackages?: number;  // Number of packages/cartons for this item
  pkgType?: string;  // Packing type: CARTON,BAG,DRUM,ROLL,PALLET,LOOSE
  actualWeight?: number;  // Actual weight in KG
  lengthCm?: number;  // Package length in CM — for volumetric weight
  widthCm?: number;  // Package width in CM
  heightCm?: number;  // Package height in CM
  volWeightKg?: number;  // Calculated volumetric weight — max(actual, vol) = chargeable weight
  isDangerous?: boolean;  // Dangerous goods flag — requires special handling
  barcodeNo?: string;  // Individual package barcode / QR code. Used at every scan point: pickup, hub load, hub receive, delivery. One per package
  pickedQty?: number;  // Packages actually picked by driver during PRN. Updated in txn_prn_bookings. May be < num_packages if partial pickup. If 
  verifiedQty?: number;  // Packages verified by hub/counter staff on weigh-bridge. Confirmation that physical count matches picked_qty before LR ge
  loadedQty?: number;  // Packages scanned+loaded into vehicle at manifest dispatch. Set when hub staff scans package barcode during manifest load
  receivedQty?: number;  // Packages received and scanned at destination hub. Set when destination hub staff scans incoming packages.
  deliveredQty?: number;  // Packages actually delivered to consignee. Captured during DRS delivery + POD. Enables partial delivery: deliver some now
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
