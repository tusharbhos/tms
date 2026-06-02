import { z } from 'zod';
import { CreateAddressesSchema } from './create-addresses.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateAddressesSchema = CreateAddressesSchema.partial();
export type UpdateAddressesDto = z.infer<typeof UpdateAddressesSchema>;
