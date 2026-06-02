import { GeoHierarchy } from '../entities/geo-hierarchy.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toGeoHierarchyResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toGeoHierarchyList(rows: any[]) {
  return rows.map(toGeoHierarchyResponse);
}