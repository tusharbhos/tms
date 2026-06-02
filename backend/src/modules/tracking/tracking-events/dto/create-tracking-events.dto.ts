import { z } from 'zod';

// CREATE DTO for txn_tracking_events — validated business fields only.
export const CreateTrackingEventsSchema = z.object({
  lrId: z.number(),
  tripId: z.number(),
  manifestId: z.number(),
  statusCode: z.string().optional().nullable(),
  statusLabel: z.string().optional().nullable(),
  eventType: z.string().optional().nullable(),
  eventSource: z.string().optional().nullable(),
  visibilityToCustomer: z.boolean().optional().nullable(),
  officeId: z.number(),
  officeName: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  eventTime: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  deviceId: z.string(),
  trackingAccuracy: z.number().optional().nullable(),
  batteryPercentage: z.number().optional().nullable(),
});

export type CreateTrackingEventsDto = z.infer<typeof CreateTrackingEventsSchema>;