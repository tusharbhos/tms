import { z } from 'zod';

// CREATE DTO for tenant_feature_flags — validated business fields only.
export const CreateTenantFeatureFlagsSchema = z.object({
  featureFlagId: z.number(),
  featureKey: z.string().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
  limitValue: z.number().optional().nullable(),
  overrideValue: z.string().optional().nullable(),
  validFrom: z.coerce.date().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateTenantFeatureFlagsDto = z.infer<typeof CreateTenantFeatureFlagsSchema>;