import { Claims } from '../entities/claims.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toClaimsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    incidentId: row.incidentId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toClaimsList(rows: any[]) {
  return rows.map(toClaimsResponse);
}