import { UserOtps } from '../entities/user-otps.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toUserOtpsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toUserOtpsList(rows: any[]) {
  return rows.map(toUserOtpsResponse);
}