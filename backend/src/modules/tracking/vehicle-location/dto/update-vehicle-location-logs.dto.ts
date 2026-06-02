import { z } from 'zod';
import { CreateVehicleLocationLogsSchema } from './create-vehicle-location-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVehicleLocationLogsSchema = CreateVehicleLocationLogsSchema.partial();
export type UpdateVehicleLocationLogsDto = z.infer<typeof UpdateVehicleLocationLogsSchema>;
