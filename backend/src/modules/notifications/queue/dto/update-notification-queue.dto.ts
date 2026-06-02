import { z } from 'zod';
import { CreateNotificationQueueSchema } from './create-notification-queue.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateNotificationQueueSchema = CreateNotificationQueueSchema.partial();
export type UpdateNotificationQueueDto = z.infer<typeof UpdateNotificationQueueSchema>;
