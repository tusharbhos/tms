import { IncidentTypeMaster } from '../entities/incident-type-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toIncidentTypeMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toIncidentTypeMasterList(rows: any[]) {
  return rows.map(toIncidentTypeMasterResponse);
}