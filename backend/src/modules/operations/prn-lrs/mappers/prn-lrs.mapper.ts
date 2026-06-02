import { PrnLrs } from '../entities/prn-lrs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPrnLrsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    prnId: row.prnId?.toString(),
    lrId: row.lrId?.toString(),
    bookingId: row.bookingId?.toString(),
  };
}

export function toPrnLrsList(rows: any[]) {
  return rows.map(toPrnLrsResponse);
}