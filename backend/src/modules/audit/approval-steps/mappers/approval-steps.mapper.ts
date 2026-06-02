import { ApprovalSteps } from '../entities/approval-steps.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toApprovalStepsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toApprovalStepsList(rows: any[]) {
  return rows.map(toApprovalStepsResponse);
}