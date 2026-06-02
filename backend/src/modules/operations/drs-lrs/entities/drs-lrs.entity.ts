// Auto-generated entity for `txn_drs_lrs` (29 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DrsLrs {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  drsId?: number;  // FK → txn_drs.id
  lrId?: number;  // FK → txn_lr.id
  tripLrId?: number;  // FK → txn_trip_lrs.id
  seqNo?: number;  // Delivery sequence in route
  consigneeName?: string;  // Consignee name snapshot for driver reference
  consigneeMobile?: string;  // Consignee mobile — for OFD notification
  deliveryAddr?: string;  // Delivery address — with Google Maps link
  numPackages?: number;  // Packages to deliver
  topayAmount?: number;  // TOPAY amount to collect — freight due at delivery
  codAmount?: number;  // COD: goods invoice amount to collect
  delStatus?: string;  // Individual LR delivery status
  podId?: number;  // FK → txn_pod.id — set when POD uploaded
  failReasonId?: number;  // FK → masterdata_reason_master.id
  reattemptDate?: Date;  // Scheduled reattempt delivery date
  attemptNo?: number;  // Delivery attempt number for this LR. Starts at 1. On failed delivery → new DRS row for same LR with attempt_no+1. Max 3 
  otpRequired?: boolean;  // Whether OTP verification is required for this delivery. TRUE for: high-value consignments, COD, contractual customers wh
  otpVerified?: boolean;  // Whether consignee OTP was successfully verified during delivery. If otp_required=TRUE: this must be TRUE before del_stat
  receiverOtp?: string;  // OTP entered by driver as provided by consignee. Hash before storing. Never return in API response. Compare with sent OTP
  deliveryLatitude?: number;  // GPS latitude captured when driver marks delivery done. Geo-fence check: verify driver was within 500m of consignee addre
  deliveryLongitude?: number;  // GPS longitude at delivery. Range: -180 to +180.
  deliveryPhotoUrl?: string;  // CDN URL of delivery proof photo taken by driver. Shows goods placed at consignee door/reception. Required for all delive
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
