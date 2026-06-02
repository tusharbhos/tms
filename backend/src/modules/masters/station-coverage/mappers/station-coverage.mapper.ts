import { StationCoverage } from '../entities/station-coverage.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toStationCoverageResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toStationCoverageList(rows: any[]) {
  return rows.map(toStationCoverageResponse);
}