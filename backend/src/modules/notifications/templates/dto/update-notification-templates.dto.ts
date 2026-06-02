import { z } from 'zod';
import { CreateNotificationTemplatesSchema } from './create-notification-templates.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateNotificationTemplatesSchema = CreateNotificationTemplatesSchema.partial();
export type UpdateNotificationTemplatesDto = z.infer<typeof UpdateNotificationTemplatesSchema>;
