import { z } from 'zod';
import { CreateUserOtpsSchema } from './create-user-otps.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateUserOtpsSchema = CreateUserOtpsSchema.partial();
export type UpdateUserOtpsDto = z.infer<typeof UpdateUserOtpsSchema>;
