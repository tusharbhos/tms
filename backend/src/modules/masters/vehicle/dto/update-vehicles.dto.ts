import { z } from 'zod';
import { CreateVehiclesSchema } from './create-vehicles.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVehiclesSchema = CreateVehiclesSchema.partial();
export type UpdateVehiclesDto = z.infer<typeof UpdateVehiclesSchema>;
