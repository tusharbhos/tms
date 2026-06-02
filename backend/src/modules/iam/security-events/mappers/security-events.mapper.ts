import { SecurityEvents } from '../entities/security-events.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toSecurityEventsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    relatedLoginAttemptId: row.relatedLoginAttemptId?.toString(),
  };
}

export function toSecurityEventsList(rows: any[]) {
  return rows.map(toSecurityEventsResponse);
}