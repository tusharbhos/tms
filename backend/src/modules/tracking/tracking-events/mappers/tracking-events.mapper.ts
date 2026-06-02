import { TrackingEvents } from '../entities/tracking-events.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTrackingEventsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    lrId: row.lrId?.toString(),
    tripId: row.tripId?.toString(),
    manifestId: row.manifestId?.toString(),
  };
}

export function toTrackingEventsList(rows: any[]) {
  return rows.map(toTrackingEventsResponse);
}