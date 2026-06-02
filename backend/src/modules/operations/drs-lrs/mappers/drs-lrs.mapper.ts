import { DrsLrs } from '../entities/drs-lrs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDrsLrsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    drsId: row.drsId?.toString(),
    lrId: row.lrId?.toString(),
    tripLrId: row.tripLrId?.toString(),
    podId: row.podId?.toString(),
  };
}

export function toDrsLrsList(rows: any[]) {
  return rows.map(toDrsLrsResponse);
}