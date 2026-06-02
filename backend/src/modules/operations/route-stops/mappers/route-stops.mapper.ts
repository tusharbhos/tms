import { RouteStops } from '../entities/route-stops.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toRouteStopsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toRouteStopsList(rows: any[]) {
  return rows.map(toRouteStopsResponse);
}