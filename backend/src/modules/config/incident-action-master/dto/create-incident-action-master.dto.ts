import { z } from 'zod';

// CREATE DTO for incident_action_master — validated business fields only.
export const CreateIncidentActionMasterSchema = z.object({
  incidentTypeId: z.number(),
  actionCode: z.string().optional().nullable(),
  actionName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  defaultSlaHours: z.number().optional().nullable(),
  isMandatory: z.boolean().optional().nullable(),
  sequenceOrder: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateIncidentActionMasterDto = z.infer<typeof CreateIncidentActionMasterSchema>;