import { CpKyc } from '../entities/cp-kyc.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCpKycResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toCpKycList(rows: any[]) {
  return rows.map(toCpKycResponse);
}