import { ExceptionLogs } from '../entities/exception-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toExceptionLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
    lrId: row.lrId?.toString(),
    triggerRefId: row.triggerRefId?.toString(),
  };
}

export function toExceptionLogsList(rows: any[]) {
  return rows.map(toExceptionLogsResponse);
}