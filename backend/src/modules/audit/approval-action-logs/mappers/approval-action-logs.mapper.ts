import { ApprovalActionLogs } from '../entities/approval-action-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApprovalActionLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toApprovalActionLogsList(rows: any[]) {
  return rows.map(toApprovalActionLogsResponse);
}