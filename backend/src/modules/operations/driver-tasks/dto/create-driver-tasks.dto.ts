import { z } from 'zod';

// CREATE DTO for txn_driver_tasks — validated business fields only.
export const CreateDriverTasksSchema = z.object({
  driverId: z.number(),
  tripId: z.number(),
  lrId: z.number(),
  taskType: z.coerce.date().optional().nullable(),
  taskTitle: z.string().optional().nullable(),
  taskDetails: z.string().optional().nullable(),
  dueAt: z.coerce.date().optional().nullable(),
  status: z.string(),
  priority: z.string().optional().nullable(),
  reminderCount: z.number().optional().nullable(),
  lastRemindedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  completedNote: z.string().optional().nullable(),
});

export type CreateDriverTasksDto = z.infer<typeof CreateDriverTasksSchema>;