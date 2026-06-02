import { RouteMaster } from '../entities/route-master.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toRouteMasterResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toRouteMasterList(rows: any[]) {
  return rows.map(toRouteMasterResponse);
}