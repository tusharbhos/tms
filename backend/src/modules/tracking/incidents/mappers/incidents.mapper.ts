import { Incidents } from '../entities/incidents.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toIncidentsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
    lrId: row.lrId?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toIncidentsList(rows: any[]) {
  return rows.map(toIncidentsResponse);
}