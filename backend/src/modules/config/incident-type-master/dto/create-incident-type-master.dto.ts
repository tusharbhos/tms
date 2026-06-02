import { z } from 'zod';

// CREATE DTO for incident_type_master — validated business fields only.
export const CreateIncidentTypeMasterSchema = z.object({
  incidentCode: z.string().optional().nullable(),
  incidentName: z.string().optional().nullable(),
  severityDefault: z.string().optional().nullable(),
  requiresPhoto: z.boolean().optional().nullable(),
  requiresPoliceDoc: z.boolean().optional().nullable(),
  requiresRtoDoc: z.boolean().optional().nullable(),
  requiresCustomerApproval: z.boolean().optional().nullable(),
  isClaimApplicable: z.boolean().optional().nullable(),
  autoHoldShipment: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateIncidentTypeMasterDto = z.infer<typeof CreateIncidentTypeMasterSchema>;