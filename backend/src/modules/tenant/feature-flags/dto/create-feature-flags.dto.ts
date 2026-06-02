import { z } from 'zod';

// CREATE DTO for feature_flags — validated business fields only.
export const CreateFeatureFlagsSchema = z.object({
  featureKey: z.string().optional().nullable(),
  moduleName: z.string().optional().nullable(),
  featureName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  featureType: z.boolean().optional().nullable(),
  defaultValue: z.string().optional().nullable(),
  planRequired: z.string().optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateFeatureFlagsDto = z.infer<typeof CreateFeatureFlagsSchema>;