import { DashboardWidgets } from '../entities/dashboard-widgets.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDashboardWidgetsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDashboardWidgetsList(rows: any[]) {
  return rows.map(toDashboardWidgetsResponse);
}