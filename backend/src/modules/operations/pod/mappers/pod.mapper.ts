import { Pod } from '../entities/pod.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPodResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    lrId: row.lrId?.toString(),
    drsId: row.drsId?.toString(),
    drsLrId: row.drsLrId?.toString(),
  };
}

export function toPodList(rows: any[]) {
  return rows.map(toPodResponse);
}