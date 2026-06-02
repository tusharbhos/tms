import { LrStateLog } from '../entities/lr-state-log.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toLrStateLogResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    lrId: row.lrId?.toString(),
    triggerId: row.triggerId?.toString(),
  };
}

export function toLrStateLogList(rows: any[]) {
  return rows.map(toLrStateLogResponse);
}