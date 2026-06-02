import { ApprovalRequests } from '../entities/approval-requests.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApprovalRequestsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toApprovalRequestsList(rows: any[]) {
  return rows.map(toApprovalRequestsResponse);
}