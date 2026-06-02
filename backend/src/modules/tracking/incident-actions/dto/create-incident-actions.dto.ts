import { z } from 'zod';

// CREATE DTO for txn_incident_actions — validated business fields only.
export const CreateIncidentActionsSchema = z.object({
  incidentId: z.number(),
  actionType: z.string().optional().nullable(),
  actionStatus: z.string().optional().nullable(),
  assignedTo: z.number().optional().nullable(),
  dueAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  completedBy: z.number().optional().nullable(),
});

export type CreateIncidentActionsDto = z.infer<typeof CreateIncidentActionsSchema>;