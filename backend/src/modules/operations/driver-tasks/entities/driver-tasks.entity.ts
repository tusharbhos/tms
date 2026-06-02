// Auto-generated entity for `txn_driver_tasks` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DriverTasks {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  driverId?: number;  // FK → masterdata_driver.id
  tripId?: number;  // FK → txn_trip.id — related trip
  lrId?: number;  // FK → txn_lr.id — specific LR for delivery/pickup task
  taskType?: Date;  // Type of task
  taskTitle?: string;  // Short task title shown in driver app notification
  taskDetails?: string;  // Full task description with address / instructions
  dueAt?: Date;  // When task must be completed
  status?: string;  // Task completion status
  priority?: string;  // Task urgency
  reminderCount?: number;  // How many reminders sent so far
  lastRemindedAt?: Date;  // Last reminder notification sent
  completedAt?: Date;  // When driver completed task
  completedNote?: string;  // Driver note on completion
  createdAt: Date;  // Auto by DB
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
