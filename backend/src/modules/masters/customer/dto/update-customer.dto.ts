import { z } from 'zod';
import { CreateCustomerSchema } from './create-customer.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustomerSchema = CreateCustomerSchema.partial();
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
