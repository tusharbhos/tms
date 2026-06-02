// Auto-generated entity for `txn_incidents` (34 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Incidents {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe UUID
  incidentNo?: string;  // Auto-generated incident number. e.g. INC-2526-000001
  tenantId?: number;  // FK → masterdata_tenant.id — Mandatory
  incidentTypeId?: number;  // FK → incident_type_master.id — Type of incident
  severity?: string;  // Severity level. CRITICAL = theft/major accident. HIGH = breakdown/police hold. MEDIUM = damage/shortage. LOW = minor del
  entityType?: string;  // Which entity the incident relates to
  entityId?: number;  // ID of the related entity (trip_id / manifest_id / lr_id etc.)
  lrId?: number;  // FK → txn_lr.id — Primary LR affected (nullable if multi-LR)
  tripId?: number;  // FK → txn_trip.id — Trip in progress when incident occurred
  vehicleId?: number;  // FK → masterdata_vehicles.id — Vehicle involved
  driverId?: number;  // FK → masterdata_driver.id — Driver involved
  officeId?: number;  // FK → masterdata_office.id — Branch/hub where incident is managed
  incidentDatetime?: Date;  // Actual date-time when incident occurred (not reported time)
  latitude?: number;  // GPS latitude where incident occurred
  longitude?: number;  // GPS longitude where incident occurred
  incidentLocation?: string;  // Human-readable location description. e.g. 'NH48, near Pune Toll'
  description?: string;  // Full incident description by driver/ops
  reportedBy?: number;  // FK → masterdata_users.id — Who reported (driver/ops/hub staff)
  incidentStatus?: string;  // Incident lifecycle status
  assignedTo?: number;  // FK → masterdata_users.id — Ops staff responsible for resolution
  resolutionDeadline?: Date;  // SLA deadline to resolve. CRITICAL=2hr, HIGH=4hr, MEDIUM=8hr, LOW=24hr
  resolvedAt?: Date;  // Actual resolution timestamp
  resolutionNote?: string;  // Final resolution description. What was done to resolve.
  policeReportNo?: string;  // FIR/NCR number for accident or theft incidents
  rtoChallanNo?: string;  // RTO challan/seizure number if vehicle held by RTO
  isClaimRequired?: boolean;  // TRUE = insurance/compensation claim to be raised
  customerNotified?: boolean;  // Whether customer/consignee has been informed about the incident
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
