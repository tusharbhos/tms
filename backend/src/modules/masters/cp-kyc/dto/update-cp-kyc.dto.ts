import { z } from 'zod';
import { CreateCpKycSchema } from './create-cp-kyc.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCpKycSchema = CreateCpKycSchema.partial();
export type UpdateCpKycDto = z.infer<typeof UpdateCpKycSchema>;
