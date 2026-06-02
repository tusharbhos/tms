import { ReasonMaster } from '../entities/reason-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toReasonMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toReasonMasterList(rows: any[]) {
  return rows.map(toReasonMasterResponse);
}