// Auto-generated entity for `txn_trip_expenses` (26 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TripExpenses {
  id: number;  // PK — Auto-increment.
  uuid?: string;  // External UUID. Used in expense approval API.
  tenantId?: number;  // FK → masterdata_tenant.id.
  tripId?: number;  // FK → txn_trip.id. Which trip this expense belongs to.
  driverId?: number;  // FK → masterdata_driver.id. Who claimed this expense.
  expenseType?: string;  // Category: TOLL, PARKING, RTO_FINE, POLICE_FINE, REPAIR, DRIVER_ALLOWANCE, DETENTION, FUEL_ADVANCE, MISC.
  expenseSubtype?: string;  // Sub-category. e.g. TOLL→HIGHWAY/CITY, REPAIR→TYRE/ENGINE.
  amount?: number;  // Expense amount in INR.
  currency?: string;  // Currency code. Default INR.
  paymentMode?: string;  // How expense was paid.
  location?: string;  // Where expense occurred. e.g. Pune Toll Plaza, Nashik Highway.
  latitude?: number;  // GPS latitude where expense was incurred.
  longitude?: number;  // GPS longitude where expense was incurred.
  receiptUrl?: string;  // CDN URL of expense receipt photo. Mandatory for REPAIR, FINE.
  expenseTime?: Date;  // When expense was incurred. Driver enters or GPS auto-captures.
  status?: string;  // Approval status of this expense.
  approvedBy?: number;  // FK → masterdata_users.id — Hub ops / finance who approved.
  approvedAt?: Date;  // When expense was approved.
  rejectReason?: string;  // Reason for rejection. Mandatory if status=REJECTED.
  sapExpenseId?: string;  // SAP/ERP expense document reference. Set after successful sync.
  createdBy?: number;  // FK → masterdata_users.id (driver or ops)
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB.
  updatedAt: Date;  // Auto by DB.
  deletedAt?: Date;  // Soft-delete. NULL = active.
  deletedBy?: number;  // FK → masterdata_users.id
}
