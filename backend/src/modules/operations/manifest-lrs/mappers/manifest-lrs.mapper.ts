import { ManifestLrs } from '../entities/manifest-lrs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toManifestLrsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    manifestId: row.manifestId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toManifestLrsList(rows: any[]) {
  return rows.map(toManifestLrsResponse);
}