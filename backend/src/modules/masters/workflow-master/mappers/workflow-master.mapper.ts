import { WorkflowMaster } from '../entities/workflow-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toWorkflowMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toWorkflowMasterList(rows: any[]) {
  return rows.map(toWorkflowMasterResponse);
}