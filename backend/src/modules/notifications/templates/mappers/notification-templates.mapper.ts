import { NotificationTemplates } from '../entities/notification-templates.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toNotificationTemplatesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toNotificationTemplatesList(rows: any[]) {
  return rows.map(toNotificationTemplatesResponse);
}