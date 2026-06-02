import { LoginAttempts } from '../entities/login-attempts.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toLoginAttemptsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    sessionId: row.sessionId?.toString(),
  };
}

export function toLoginAttemptsList(rows: any[]) {
  return rows.map(toLoginAttemptsResponse);
}