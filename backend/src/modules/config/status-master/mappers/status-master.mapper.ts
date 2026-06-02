import { StatusMaster } from '../entities/status-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toStatusMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toStatusMasterList(rows: any[]) {
  return rows.map(toStatusMasterResponse);
}