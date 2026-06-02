// Auto-generated entity for `scheduled_jobs` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ScheduledJobs {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  jobName?: string;  // e.g. Auto Invoice Generator, DL Expiry Alert
  cronExpression?: string;  // e.g. 0 9 * * 1 = every Monday 9 AM
  jobHandler?: string;  // Class/function that executes this job
  retryAttempts?: number;  // Max retries on failure before marking failed
  lastRunAt?: Date;  // Last execution timestamp
  nextRunAt?: Date;  // Pre-calculated next execution time
  lastRunStatus?: string;  // Job health monitoring
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who performed soft-delete
}
