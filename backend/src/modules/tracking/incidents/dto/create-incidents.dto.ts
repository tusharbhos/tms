import { z } from 'zod';

// CREATE DTO for txn_incidents — validated business fields only.
export const CreateIncidentsSchema = z.object({
  incidentNo: z.string().optional().nullable(),
  incidentTypeId: z.number(),
  severity: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  lrId: z.number(),
  tripId: z.number(),
  vehicleId: z.number(),
  driverId: z.number(),
  officeId: z.number(),
  incidentDatetime: z.coerce.date().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  incidentLocation: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  reportedBy: z.number().optional().nullable(),
  incidentStatus: z.string().optional().nullable(),
  assignedTo: z.number().optional().nullable(),
  resolutionDeadline: z.coerce.date().optional().nullable(),
  resolvedAt: z.coerce.date().optional().nullable(),
  resolutionNote: z.string().optional().nullable(),
  policeReportNo: z.string().optional().nullable(),
  rtoChallanNo: z.string().optional().nullable(),
  isClaimRequired: z.boolean().optional().nullable(),
  customerNotified: z.boolean().optional().nullable(),
});

export type CreateIncidentsDto = z.infer<typeof CreateIncidentsSchema>;