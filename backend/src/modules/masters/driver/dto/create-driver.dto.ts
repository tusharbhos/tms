import { z } from 'zod';

// CREATE DTO for driver — validated business fields only.
export const CreateDriverSchema = z.object({
  vendorId: z.number(),
  homeOfficeId: z.number(),
  name: z.string(),
  mobile: z.string(),
  dlNumber: z.string().optional().nullable(),
  dlCategory: z.string().optional().nullable(),
  dlExpiryDate: z.coerce.date().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactMobile: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  medicalFitnessExpiry: z.coerce.date().optional().nullable(),
  driverStatus: z.string().optional().nullable(),
  driverRating: z.number().optional().nullable(),
  totalTrips: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateDriverDto = z.infer<typeof CreateDriverSchema>;