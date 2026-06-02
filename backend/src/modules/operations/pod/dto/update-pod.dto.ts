import { z } from 'zod';
import { CreatePodSchema } from './create-pod.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePodSchema = CreatePodSchema.partial();
export type UpdatePodDto = z.infer<typeof UpdatePodSchema>;
