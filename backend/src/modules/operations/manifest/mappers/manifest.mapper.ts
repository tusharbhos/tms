import { Manifest } from '../entities/manifest.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toManifestResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toManifestList(rows: any[]) {
  return rows.map(toManifestResponse);
}