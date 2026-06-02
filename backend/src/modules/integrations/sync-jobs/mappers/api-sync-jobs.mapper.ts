import { ApiSyncJobs } from '../entities/api-sync-jobs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApiSyncJobsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
  };
}

export function toApiSyncJobsList(rows: any[]) {
  return rows.map(toApiSyncJobsResponse);
}