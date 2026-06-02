import { IncidentActions } from '../entities/incident-actions.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toIncidentActionsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    incidentId: row.incidentId?.toString(),
  };
}

export function toIncidentActionsList(rows: any[]) {
  return rows.map(toIncidentActionsResponse);
}