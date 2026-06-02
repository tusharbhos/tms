import { ActivityLogs } from '../entities/activity-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toActivityLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    recordId: row.recordId?.toString(),
  };
}

export function toActivityLogsList(rows: any[]) {
  return rows.map(toActivityLogsResponse);
}