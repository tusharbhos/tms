import { z } from 'zod';

// CREATE DTO for fm_fuel_log — validated business fields only.
export const CreateFuelLogSchema = z.object({
  tripId: z.number(),
  vehicleId: z.number(),
  driverId: z.number(),
  fuelDate: z.coerce.date().optional().nullable(),
  pumpName: z.string().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  quantityLiters: z.number().optional().nullable(),
  ratePerLiter: z.number().optional().nullable(),
  totalAmount: z.number().optional().nullable(),
  meterReading: z.number().optional().nullable(),
  billUrl: z.string().optional().nullable(),
  isCompanyPaid: z.boolean().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type CreateFuelLogDto = z.infer<typeof CreateFuelLogSchema>;