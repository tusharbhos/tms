import { Departments } from '../entities/departments.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDepartmentsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDepartmentsList(rows: any[]) {
  return rows.map(toDepartmentsResponse);
}