// Auto-generated entity for `txn_tracking_events` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TrackingEvents {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  lrId?: number;  // FK → txn_lr.id — which LR this event is for
  tripId?: number;  // FK → txn_trip.id — which trip caused this event
  manifestId?: number;  // FK → txn_manifest.id
  statusCode?: string;  // Status code from status_master e.g. IN_TRANSIT, DELIVERED
  statusLabel?: string;  // Human-readable status label — for customer tracking
  eventType?: string;  // Source of tracking event
  eventSource?: string;  // What generated this tracking event. MANUAL=ops typed. SCAN=barcode/QR scanner. GPS=auto from vehicle GPS device. API=ext
  visibilityToCustomer?: boolean;  // Whether this event is shown on the customer-facing tracking page. FALSE for: internal hub-transfer events, system events
  officeId?: number;  // FK → masterdata_office.id — hub where event occurred
  officeName?: string;  // Snapshot office name — for fast customer display
  latitude?: number;  // GPS latitude at event time
  longitude?: number;  // GPS longitude at event time
  eventTime?: Date;  // Actual time of event — may differ from created_at
  remarks?: string;  // Event remarks — shown to customer on tracking page
  deviceId?: string;  // Device identifier of GPS tracker or driver mobile that generated this event. Links to GPS device config.
  trackingAccuracy?: number;  // GPS accuracy in meters. Lower = more accurate. e.g. 5.0 = ±5m accuracy
  batteryPercentage?: number;  // Driver/device battery % at time of event. Alert ops if battery < 15% during active trip.
  updatedBy?: number;  // FK → masterdata_users.id — who last updated this event.
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP. When event was recorded.
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP.
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
