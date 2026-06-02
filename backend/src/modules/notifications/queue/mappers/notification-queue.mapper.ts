import { NotificationQueue } from '../entities/notification-queue.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toNotificationQueueResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    entityId: row.entityId?.toString(),
  };
}

export function toNotificationQueueList(rows: any[]) {
  return rows.map(toNotificationQueueResponse);
}