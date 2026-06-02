// Auto-generated entity for `txn_lr` (40 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Lr {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID — for tracking, WhatsApp link
  lrNo?: string;  // Auto-generated LR number from number_series_config
  bookingId?: number;  // FK → txn_booking.id — parent booking. ALWAYS set, even for direct LR (system auto-creates booking in background). Never 
  tenantId?: number;  // FK → masterdata_tenant.id
  companyId?: number;  // FK → masterdata_company.id
  originOfficeId?: number;  // FK → masterdata_office.id — where LR was generated
  destinationOfficeId?: number;  // FK → masterdata_office.id — final delivery hub
  currentOfficeId?: number;  // FK → masterdata_office.id — where consignment is NOW
  consignorId?: number;  // FK → masterdata_customer.id — sender snapshot
  consigneeId?: number;  // FK → masterdata_customer.id — receiver snapshot
  consignorName?: string;  // Snapshot: consignor name at time of LR creation
  consignorAddr?: string;  // Snapshot: consignor address
  consignorGst?: string;  // Snapshot: consignor GST number
  consigneeName?: string;  // Snapshot: consignee name
  consigneeAddr?: string;  // Snapshot: consignee address
  consigneeGst?: string;  // Snapshot: consignee GST number
  consigneeMobile?: string;  // Snapshot: consignee mobile — for delivery notification
  totalPackages?: number;  // Total number of packages — sum from booking_items
  totalWeightKg?: number;  // Total actual weight in KG
  chargeableWeight?: number;  // max(actual, volumetric) weight — used for freight
  totalCharges?: number;  // Total freight charges including GST
  paymentType?: string;  // Payment mode
  lrStatus?: string;  // LR lifecycle status from status_master
  currentStatusCode?: string;  // Latest status code — synced with txn_tracking_events
  ewaybillNo?: string;  // E-way bill number — from txn_ewaybill
  ewaybillExpiry?: Date;  // E-way bill validity date — alert if trip still in transit after expiry
  podRequired?: boolean;  // Whether physical POD is mandatory
  podId?: number;  // FK → txn_pod.id — set when POD uploaded
  isReturnLr?: boolean;  // TRUE = return / RTO LR
  originalLrId?: number;  // FK → txn_lr.id — self-reference for return LR
  printedAt?: Date;  // When LR was first printed
  printedBy?: number;  // FK → masterdata_users.id — Who printed LR
  lrSource?: string;  // How this LR was created. DIRECT = godown counter, LR and booking auto-created together. FROM_BOOKING = booking confirmed
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}

export const LrStatuses = ["CREATED", "HUB_RECEIVED", "IN_MANIFEST", "IN_TRANSIT", "ARRIVED_AT_DEST", "IN_DRS", "OUT_FOR_DELIVERY", "ATTEMPTED_FAILED", "DELIVERED", "RTO", "CANCELLED"] as const;
export type LrStatus = (typeof LrStatuses)[number];

export const LrTransitions: Record<string, string[]> = {
  "CREATED": [
    "HUB_RECEIVED",
    "CANCELLED"
  ],
  "HUB_RECEIVED": [
    "IN_MANIFEST",
    "CANCELLED"
  ],
  "IN_MANIFEST": [
    "IN_TRANSIT"
  ],
  "IN_TRANSIT": [
    "ARRIVED_AT_DEST"
  ],
  "ARRIVED_AT_DEST": [
    "IN_DRS"
  ],
  "IN_DRS": [
    "OUT_FOR_DELIVERY"
  ],
  "OUT_FOR_DELIVERY": [
    "DELIVERED",
    "ATTEMPTED_FAILED"
  ],
  "ATTEMPTED_FAILED": [
    "OUT_FOR_DELIVERY",
    "RTO"
  ],
  "DELIVERED": [],
  "RTO": [],
  "CANCELLED": []
};
