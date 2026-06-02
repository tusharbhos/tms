import { PackageScanLogs } from '../entities/package-scan-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPackageScanLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    lrId: row.lrId?.toString(),
    bookingId: row.bookingId?.toString(),
    bookingItemId: row.bookingItemId?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toPackageScanLogsList(rows: any[]) {
  return rows.map(toPackageScanLogsResponse);
}