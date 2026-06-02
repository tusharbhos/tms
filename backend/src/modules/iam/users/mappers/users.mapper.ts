import { Users } from '../entities/users.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toUsersResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toUsersList(rows: any[]) {
  return rows.map(toUsersResponse);
}