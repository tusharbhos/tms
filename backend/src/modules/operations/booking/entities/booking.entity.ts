// Auto-generated entity for `txn_booking` (45 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Booking {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 on INSERT trigger
  bookingNo?: string;  // Auto-generated from number_series_config. e.g. BKG-2526-000001
  tenantId?: number;  // FK → masterdata_tenant.id — Mandatory
  companyId?: number;  // FK → masterdata_company.id
  bookingOfficeId?: number;  // FK → masterdata_office.id — Branch where booking is created
  customerId?: number;  // FK → masterdata_customer.id — Billing/contractual customer
  consignorId?: number;  // FK → masterdata_customer.id — Sender (may differ from customer)
  consigneeId?: number;  // FK → masterdata_customer.id — Receiver
  billingPartyId?: number;  // FK → masterdata_customer.id — Who pays the bill
  contractId?: number;  // FK → masterdata_cust_contract.id — Rate contract used
  pickupAddressId?: number;  // FK → masterdata_addresses.id — Door pickup address
  deliveryAddressId?: number;  // FK → masterdata_addresses.id — Door delivery address
  originHubId?: number;  // FK → masterdata_office.id — Origin servicing hub
  destinationHubId?: number;  // FK → masterdata_office.id — Destination delivery hub
  originPincode?: string;  // Origin pincode — from consignor address
  destinationPincode?: string;  // Destination pincode — from consignee address
  isOda?: boolean;  // Out-of-Delivery-Area flag — auto-set from geo_hierarchy
  paymentType?: string;  // Who pays freight
  pickupType?: string;  // Pickup mode — DOOR=driver goes to sender | GODOWN=sender drops
  deliveryType?: string;  // Delivery mode — DOOR=driver delivers | GODOWN=consignee collects
  loadType?: string;  // Full/Less/Small Truck Load
  deliverySpeed?: string;  // Service level — drives TAT calculation
  priority?: string;  // Internal priority for ops team
  bookingDate?: Date;  // Date of booking — can differ from created_at
  expectedPickupAt?: Date;  // When driver should pick up goods — for PRN scheduling
  expectedDeliveryAt?: Date;  // Promised delivery date — SLA commitment to customer
  specialInstructions?: string;  // Free text — fragile, keep upright, temperature-sensitive etc
  bookingStatus?: string;  // Lifecycle status from status_master. e.g. DRAFT→CONFIRMED→LR_GENERATED
  cancelReasonId?: number;  // FK → masterdata_reason_master.id — Cancel reason
  cancelNotes?: string;  // Additional cancel notes — required if reason.requires_note=TRUE
  refNum?: string;  // Customer reference / purchase order number — optional
  ewaybillRequired?: boolean;  // Auto-set: if consignment value > ₹50,000 → TRUE
  bookingFlowType?: string;  // Core routing logic. DIRECT_LR = goods brought to godown/counter → LR created immediately. PICKUP_TO_LR = door pickup → P
  bookingSource?: string;  // Channel where booking originated. COUNTER=ops team at branch. CUSTOMER_PORTAL=self-service web. MOBILE_APP=customer/driv
  isDirectLr?: boolean;  // Shortcut flag — TRUE if LR should be generated at booking time (GODOWN). FALSE if LR waits for PRN pickup completion (DO
  actualPickupAt?: Date;  // Actual time when goods were picked up by driver (DOOR) or received at counter (GODOWN). Separate from booking creation t
  verifiedBy?: number;  // FK → masterdata_users.id — Hub/counter staff who verified weight and package count. Required before LR generation. Ensur
  actualWeightVerifiedAt?: Date;  // Timestamp when weight was physically verified on weigh-bridge or scale. May differ from booking time. Used in: dispute r
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
}

export const BookingStatuses = ["DRAFT", "CONFIRMED", "LR_GENERATED", "CLOSED", "CANCELLED"] as const;
export type BookingStatus = (typeof BookingStatuses)[number];

export const BookingTransitions: Record<string, string[]> = {
  "DRAFT": [
    "CONFIRMED",
    "CANCELLED"
  ],
  "CONFIRMED": [
    "LR_GENERATED",
    "CANCELLED"
  ],
  "LR_GENERATED": [
    "CLOSED",
    "CANCELLED"
  ],
  "CLOSED": [],
  "CANCELLED": []
};
