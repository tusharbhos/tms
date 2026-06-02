import { z } from 'zod';
import { CreateStationCoverageSchema } from './create-station-coverage.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateStationCoverageSchema = CreateStationCoverageSchema.partial();
export type UpdateStationCoverageDto = z.infer<typeof UpdateStationCoverageSchema>;
