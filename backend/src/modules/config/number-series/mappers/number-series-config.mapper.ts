import { NumberSeriesConfig } from '../entities/number-series-config.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toNumberSeriesConfigResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toNumberSeriesConfigList(rows: any[]) {
  return rows.map(toNumberSeriesConfigResponse);
}