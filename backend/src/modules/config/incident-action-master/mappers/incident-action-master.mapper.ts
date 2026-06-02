import { IncidentActionMaster } from '../entities/incident-action-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toIncidentActionMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toIncidentActionMasterList(rows: any[]) {
  return rows.map(toIncidentActionMasterResponse);
}