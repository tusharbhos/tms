import { UserSessions } from '../entities/user-sessions.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toUserSessionsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toUserSessionsList(rows: any[]) {
  return rows.map(toUserSessionsResponse);
}