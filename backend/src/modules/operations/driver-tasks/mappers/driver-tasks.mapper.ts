import { DriverTasks } from '../entities/driver-tasks.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDriverTasksResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toDriverTasksList(rows: any[]) {
  return rows.map(toDriverTasksResponse);
}