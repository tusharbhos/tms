import { ScheduledJobs } from '../entities/scheduled-jobs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toScheduledJobsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toScheduledJobsList(rows: any[]) {
  return rows.map(toScheduledJobsResponse);
}