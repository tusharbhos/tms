import { StatusChangeLogs } from '../entities/status-change-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toStatusChangeLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
    triggerRefId: row.triggerRefId?.toString(),
  };
}

export function toStatusChangeLogsList(rows: any[]) {
  return rows.map(toStatusChangeLogsResponse);
}